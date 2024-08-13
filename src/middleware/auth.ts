import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { UserType } from "../models/User";

//Cambiar el type del Request de express para poder enviar a user
declare global {
  namespace Express {
    interface Request {
      user?: UserType;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Verificar si existe el token recibido en la cabecera de la petición
  const bearer = req.headers.authorization;

  if (!bearer) {
    const error = new Error("No Autorizado");
    return res.status(401).json({ error: error.message });
  } // Separar el token del bearer pq esto llega siempre en este formato 'Bearer 'token'' y solo necesitamos el token

  const token = bearer.split(" ")[1];

  try {
    // Verificar si el token es válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof decoded === "object" && decoded.id) {
      //Verificar si el usuario existe en base al id enviado en el token JWT
      const user = await User.findById(decoded.id).select("_id name email"); //Si el usuario existe, lo guardamos en la petición
      if (user) {
        req.user = user;
        next();
      } else {
        return res.status(500).json({ error: "Token no valido" });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: "Token inválido" });
  }
};
