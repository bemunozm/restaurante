import jwt from "jsonwebtoken";
import Types from "mongoose";

type UserPayload = {
  id: Types.ObjectId;
};

export const generateJWT = (payload: UserPayload) => {
  // Generar JWT
  //.sing recibe 3 parametros, el payload, la clave secreta y la expiracion
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "180d",
  });

  return token;
};
