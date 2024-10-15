import jwt from 'jsonwebtoken'
import Types, { ObjectId } from 'mongoose'

type UserPayload = {
    id: string,
    sessionId?: string,
    tableId?: string,
    role: 'Invitado' | 'Usuario',
}


export const generateJWT = (payload: UserPayload) => {
    const expiresIn = payload.role === 'Invitado' ? '1d' : '180d'
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: expiresIn
    })
    return token
}