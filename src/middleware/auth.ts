import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { UserType } from '../models/User';
import Session, { GuestType } from "../models/Session";

declare global {
    namespace Express {
        interface Request {
            user?: UserType;  // Usuario registrado
            guest?: GuestType;  // Invitado
            sessionId?: string; // ID de la sesión
            tableId?: string;   // ID de la mesa
            role: string;
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;
    
    if (!bearer) {
        const error = new Error('No Autorizado');
        return res.status(401).json({ error: error.message });
    }

    const [, token] = bearer.split(' ');

    try {
        // Decodifica el token
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

        console.log('Decoded Token:', decoded);
        
        if (decoded.sessionId) {
            req.sessionId = decoded.sessionId;
        }

        if (decoded.tableId) {
            req.tableId = decoded.tableId;
        }

        // Verifica el rol en el token para identificar si es un invitado o usuario
        if (decoded.role === 'Usuario') {
            // Usuario registrado
            const user = await User.findById(decoded.id)
                .select('_id name lastname email roles')
                .populate('roles');
                
            if (user) {
                req.user = user;  // Asigna el usuario al request
                req.role = 'Usuario';
                next();
            } else {
                return res.status(401).json({ error: 'Usuario No Encontrado' });
            }
        } else if (decoded.role === 'Invitado') {
            // Invitado
            const session = await Session.findOne({ $or: [{ "guests._id": decoded.id }, { "guests.user": decoded.id }] });

            if (!session) {
                return res.status(500).json({ error: 'Este invitado no pertenece a ninguna session activa' });
            }

            // Encuentra el invitado en la sesión
            const guest = session.guests.find((guest: any) => guest._id.toString() === decoded.id);
            if (guest) {
                req.guest = guest;  // Asigna el invitado al request
                req.role = 'Invitado';
                next();
            } else {
                return res.status(500).json({ error: 'Invitado No Encontrado' });
            }
        } else {
            return res.status(401).json({ error: 'Rol no autorizado' });
        }
    } catch (error) {
        return res.status(401).json({ error: 'Token No Válido' });
    }
};
