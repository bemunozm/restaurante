import { Request, Response } from "express";
import Client from "../models/Client";
import Table from "../models/Table";
import Session from "../models/Session";

export class SessionController {
  // CREAR SESIÓN
  static createSession = async (req: Request, res: Response) => {
    try {
      const { email, tableNumber } = req.body;

      // Buscar al cliente (se asume que ya está validado y confirmado)
      const client = await Client.findOne({ email });
      if (!client) {
        return res.status(404).json({ error: "Cliente no encontrado." });
      }

      // Buscar la mesa por su número
      const table = await Table.findOne({ number: tableNumber });
      if (!table) {
        return res.status(404).json({ error: "Mesa no encontrada." });
      }

      // Cambiar el estado de la mesa a 'pidiendo'
      table.status = 'pidiendo';
      await table.save();

      // Generar un token para la sesión
      const sessionToken = Math.floor(100000 + Math.random() * 900000).toString();

      // Crear la sesión asociada al cliente y la mesa
      const session = new Session({
        table: table._id,
        token: sessionToken,
        clients: [client._id],
        expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000), // Expira en 3 horas
      });

      await session.save();

      return res.status(200).json({ message: "Sesión iniciada", token: sessionToken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Hubo un error creando la sesión" });
    }
  };

  // UNIRSE A UNA SESIÓN
  static joinSession = async (req: Request, res: Response) => {
    try {
      const { email, tableNumber, sessionToken } = req.body;

      // Buscar al cliente (se asume que ya está validado y confirmado)
      const client = await Client.findOne({ email });
      if (!client) {
        return res.status(404).json({ error: "Cliente no encontrado." });
      }

      // Buscar la mesa por su número
      const table = await Table.findOne({ number: tableNumber });
      if (!table) {
        return res.status(404).json({ error: "Mesa no encontrada." });
      }

      // Buscar una sesión activa para esa mesa
      const activeSession = await Session.findOne({ table: table._id });
      if (!activeSession) {
        return res.status(404).json({ error: "No hay una sesión activa para esta mesa." });
      }

      // Comprobar si el token proporcionado coincide con el token de la sesión activa
      if (activeSession.token !== sessionToken) {
        return res.status(401).json({ error: "Token incorrecto para la sesión." });
      }

      // Verificar si el cliente ya está en la sesión
      const isClientInSession = activeSession.clients.some(
        (clientId) => clientId.toString() === client._id.toString()
      );

      if (isClientInSession) {
        return res.status(400).json({ error: "El cliente ya está en la sesión." });
      }

      // Añadir el cliente a la sesión
      activeSession.clients.push(client.id);
      await activeSession.save();

      res.status(200).json({ message: "Te has unido a la sesión con éxito." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Hubo un error al unirse a la sesión." });
    }
  };

  // CERRAR SESIÓN Y LIBERAR MESA
  static closeSession = async (req: Request, res: Response) => {
    try {
      const { tableNumber } = req.body;

      // Buscar la mesa por su número
      const table = await Table.findOne({ number: tableNumber });
      if (!table) {
        return res.status(404).json({ error: "Mesa no encontrada." });
      }

      // Buscar una sesión activa para esa mesa
      const activeSession = await Session.findOne({ table: table._id });
      if (!activeSession) {
        return res.status(404).json({ error: "No hay una sesión activa para esta mesa." });
      }

      // Cerrar la sesión y liberar la mesa
      await activeSession.deleteOne();
      table.status = 'disponible';
      await table.save();

      res.status(200).json({ message: "Sesión cerrada y mesa liberada." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Hubo un error al cerrar la sesión." });
    }
  };
}
