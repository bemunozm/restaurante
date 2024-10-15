import { Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
import Session, { SessionType, GuestType } from '../models/Session';
import Token from '../models/Token';
import crypto from 'crypto';
import { generateToken } from '../utils/token';
import { generateJWT } from '../utils/jwt';
import Order from '../models/Order';
import User from '../models/User';

class SessionController {

    // Crear una nueva sesión

    async createSession(req: Request, res: Response) {
        const { tableId } = req.body;

        try {

            const newSession = new Session({
                tableId: tableId,
            });

            await newSession.save();

            // Crear la instancia del SessionToken
            const newSessionToken = new Token({
                session: newSession._id,
                token: generateToken()
            });

            // Guardar el token de la sesión
            await newSessionToken.save();

            return res.status(201).json(newSession);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Obtener todas las sesiones
    async getAllSessions(req: Request, res: Response) {
        try {
            const sessions = await Session.find().populate('tableId');
            return res.status(200).json(sessions);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Obtener una sesión por ID
    async getSessionById(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const session = await Session.findById(id).populate('tableId');

            if (!session) {
                return res.status(404).json({ error: 'Session not found' });
            }

            return res.status(200).json(session);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Actualizar una sesión (por ejemplo, cerrar la sesión)
    async updateSession(req: Request, res: Response) {
        const { id } = req.params;
        const { endedAt } = req.body;

        try {
            const session = await Session.findByIdAndUpdate(
                id,
                { endedAt: endedAt ? new Date(endedAt) : new Date() },
                { new: true }
            );

            if (!session) {
                return res.status(404).json({ error: 'Session not found' });
            }

            return res.status(200).json(session);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Eliminar una sesión
    async deleteSession(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const session = await Session.findByIdAndDelete(id);

            if (!session) {
                return res.status(404).json({ error: 'Session not found' });
            }

            return res.status(200).json({ message: 'Session deleted successfully' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async addGuestToSession(req: Request, res: Response) {
        const { sessionId } = req.params;
        const { guestName, userId } = req.body;  // El userId vendrá desde la vista
    
        try {
            const session = await Session.findById(sessionId);
    
            if (!session) {
                return res.status(404).json({ error: 'Session not found' });
            }
    
            // Si tenemos un userId, significa que el usuario está autenticado en la vista
            if (userId) {
                const user = await User.findById(userId)
                // Verificar si el usuario ya está en la sesión
                const userInSession = session.guests.some(guest => guest.user && guest.user.toString() === userId.toString());
    
                if (!userInSession) {
                    // Agregar el usuario a la sesión
                    session.guests.push({ user: userId, name: user.name, orders: [] });
                    await session.save();
                }
    
                // Generar el JWT para el usuario autenticado
                const userToken = generateJWT({
                    id: userId.toString(),  // ID del usuario
                    sessionId: session.id.toString(),  // ID de la sesión
                    tableId: session.tableId.toString(),  // ID de la mesa
                    role: 'Usuario'  // Rol de usuario
                });
    
                return res.send({ token: userToken, sessionId: session._id });
            }
    
            // Si no hay un userId, creamos un nuevo invitado
            const newGuest: GuestType = {
                name: guestName,
                orders: []
            };
    
            // Agregar el nuevo invitado a la sesión
            session.guests.push(newGuest);
            await session.save();
    
            // Obtener el ID del invitado recién creado
            const guestId = session.guests[session.guests.length - 1]._id;
    
            // Generar el JWT para el invitado
            const guestToken = generateJWT({
                id: guestId.toString(),  // ID del invitado
                sessionId: session.id.toString(),  // ID de la sesión
                tableId: session.tableId.toString(),  // ID de la mesa
                role: 'Invitado'  // Rol de invitado
            });
    
            // Devolver el token del invitado para almacenarlo en el navegador
            return res.send({ token: guestToken, sessionId: session._id });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Transferir órdenes a un usuario registrado cuando el invitado se registra
    async transferGuestOrdersToUser(req: Request, res: Response) {
        const { guestId, userId } = req.body;

        try {
            // Actualizar todas las órdenes que tengan guestId con el nuevo userId
            await Order.updateMany(
                { guestId },
                { $set: { userId }, $unset: { guestId: 1 } }
            );

            return res.status(200).json({ message: 'Órdenes transferidas correctamente' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Validar el token de la sesión
    async validateToken(req: Request, res: Response) {
        const { token } = req.body;

        try {
            const tokenExists = await Token.findOne({ token })

            if (!tokenExists) {
                return res.status(404).json({ error: 'Clave Incorrecta' });
            }

            return res.send('Token válido');
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

        // Verificar si una sesión existe para una mesa
    async checkSessionExists(req: Request, res: Response) {
        const { tableId } = req.params;
    
        try {
            const session = await Session.findOne({ tableId });
    
            if (!session) {
                return res.status(200).json(null);
            }
    
            return res.status(200).json(session);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    //Obtener el token de una session

    async getSessionToken(req: Request, res: Response) {
        const { sessionId } = req.params;

        try {
            const sessionToken = await Token.findOne({ session: sessionId });

            if (!sessionToken) {
                return res.status(404).json({ error: 'Token not found' });
            }

            return res.status(200).json(sessionToken);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new SessionController();
