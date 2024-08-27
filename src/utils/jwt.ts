import jwt from 'jsonwebtoken'
import Types, { ObjectId } from 'mongoose'

type UserPayload = {
    id: Types.ObjectId
}

type ClientPayload = {
    id: string
}


export const generateJWT = (payload: UserPayload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '180d'
    })
    return token
}

export const generateClientJWT = (payload: ClientPayload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
    return token
}