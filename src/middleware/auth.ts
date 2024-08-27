import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User, { UserType } from '../models/User'
import Session, {GuestType} from "../models/Session";

declare global {
    namespace Express {
        interface Request {
            user?: UserType
            guest?: GuestType
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization
    if(!bearer) {
        const error = new Error('No Autorizado')
        return res.status(401).json({error: error.message})
    }

    const [, token] = bearer.split(' ')
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        if(typeof decoded === 'object' && decoded.id) {
            const user = await User.findById(decoded.id).select('_id name email')
            if(user) {
                req.user = user
                next()
            } else {
                res.status(500).json({error: 'Token No Válido'})
            }
        }
    } catch (error) {
        res.status(500).json({error: 'Token No Válido'})
    }

}

export const authenticateGuest = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;
    if (!bearer) {
        const error = new Error('No Autorizado');
        return res.status(401).json({ error: error.message });
    }

    const [, token] = bearer.split(' ');
    
    try {
        // Decodifica el token para obtener la ID del guest
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (typeof decoded === 'object' && decoded.id) {
            // Busca la sesión que contenga el guest con la ID proporcionada
            
            const session = await Session.findOne({ "guests._id": decoded.id });

            if (!session) {
                return res.status(500).json({ error: 'Sesión No Encontrada' });
            }

            // Busca al guest dentro de la sesión usando la ID
            const guest = session.guests.find((guest: any) => guest._id.toString() === decoded.id);
            if (guest) {
                req.guest = guest; // Asigna el guest encontrado al request
                next();
            } else {
                return res.status(500).json({ error: 'Cliente No Encontrado' });
            }
        } else {
            return res.status(500).json({ error: 'Token No Válido' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Token No Válido' });
    }
}
