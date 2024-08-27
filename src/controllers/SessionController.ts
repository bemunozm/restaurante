import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Session, { SessionType, GuestType } from '../models/Session';
import SessionToken from '../models/SessionToken';
import crypto from 'crypto';
import { generateToken } from '../utils/token';
import {generateClientJWT} from "../utils/jwt";

class SessionController {

    // Crear una nueva sesión

    async createSession(req: Request, res: Response) {
        const { tableId } = req.body;

        try {

            const newSession = new Session({
                tableId: tableId,
            });

            await newSession.save();

            // Generar un token único para la sesión (SessionToken)
            const sessionToken = generateToken();

            // Crear la instancia del SessionToken
            const newSessionToken = new SessionToken({
                session: newSession._id,
                token: sessionToken
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

    // Agregar un cliente a una sesión existente
    async addGuestToSession(req: Request, res: Response) {
        const { sessionId } = req.params;
        const { guestName } = req.body;

        try {
            const session = await Session.findById(sessionId);

            if (!session) {
                return res.status(404).json({ error: 'Session not found' });
            }

            // Crear un nuevo guest
            const newGuest: GuestType = {
                name: guestName,
                orders: []
            };

            // Agregar el nuevo guest a la sesión
            session.guests.push(newGuest);
            await session.save();

            // Obtener el ID del guest recién creado
            const guestId = session.guests[session.guests.length - 1]._id;
            
            console.log('todobien');
            // Generar el guestToken utilizando el ID del guest
             const guestToken = generateClientJWT({id: guestId.toString()});

            // Devolver el token del cliente para almacenarlo en el navegador
             return res.send({token: guestToken, sessionId: session._id});
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Validar el token de la sesión
    async validateToken(req: Request, res: Response) {
        const { token } = req.body;

        try {
            const tokenExists = await SessionToken.findOne({ token })

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

    //Autenticar un cliente
    async authenticateGuest(req: Request, res: Response) {
        return res.json(req.guest)
    }
}

export default new SessionController();
