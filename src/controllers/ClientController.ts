import { Request, Response } from "express";
import Client from "../models/Client";
import Token from "../models/Token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

export class ClientController {
  
  // VALIDAR EMAIL Y MANEJAR REGISTRO/CONFIRMACIÓN
  static validateEmail = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // Buscar si el cliente ya existe en la base de datos
      let client = await Client.findOne({ email });

      if (!client) {
        // Si no existe, registrar al cliente y enviar correo de confirmación
        client = new Client({ email, confirmed: false });
        await client.save();

        // Generar y guardar token de confirmación
        const confirmationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const token = new Token({ token: confirmationToken, user: client._id });
        await token.save();

        // Enviar email de confirmación
        AuthEmail.sendEmailConfirmation({
          email: client.email,
          name: client.email,
          token: confirmationToken,
        });

        return res.status(201).json({ message: "Cuenta creada. Revisa tu email para confirmarla." });
      }

      if (!client.confirmed) {
        // Si existe pero no está confirmado, reenviar el correo de confirmación
        let token = await Token.findOne({ user: client._id });
        if (!token) {
          const confirmationToken = Math.floor(100000 + Math.random() * 900000).toString();
          token = new Token({ token: confirmationToken, user: client._id });
          await token.save();
        }

        AuthEmail.sendEmailConfirmation({
          email: client.email,
          name: client.email,
          token: token.token,
        });

        return res.status(400).json({ error: "Debes confirmar tu correo. Se ha reenviado el correo de confirmación." });
      }

      // Si el cliente ya está confirmado, generar JWT
      const jwtToken = generateJWT({ id: client.id });
      return res.status(200).json({ token: jwtToken, message: "Autenticación exitosa." });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Hubo un error procesando la solicitud." });
    }
  };

  // CONFIRMAR CUENTA DEL CLIENTE
  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const tokenExists = await Token.findOne({ token: req.body.token });

      if (!tokenExists) {
        return res.status(404).json({ error: "Token no encontrado" });
      }

      const client = await Client.findById(tokenExists.user);
      if (!client) {
        return res.status(404).json({ error: "Cliente no encontrado" });
      }

      client.confirmed = true;
      await client.save();

      await tokenExists.deleteOne();

      res.send("Cuenta confirmada correctamente");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Hubo un error confirmando la cuenta" });
    }
  };
}
