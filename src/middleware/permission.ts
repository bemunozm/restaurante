import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import Role from "../models/Role";

// Middleware para verificar permisos
const checkPermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.user.id).populate("roles");
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const hasPermission = user.roles.some(role => role.permissions.includes(permission));

      if (hasPermission) {
        return next(); // El usuario tiene permiso, sigue a la siguiente función
      } else {
        return res.status(403).json({ message: "Acceso denegado: Sin permisos suficientes" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  };
};



export default checkPermission;
