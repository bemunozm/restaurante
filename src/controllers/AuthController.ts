import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import Token from "../models/Token";
import { AuthEmail } from "../emails/AuthEmail";

export class AuthController {
    //CREAR CUENTA
  static createAccount = async (req: Request, res: Response) => {
    try {
      const user = new User(req.body); //VALIDAR QUE EL EMAIL NO ESTE REPETIDO
      const userExists = await User.findOne({ email: req.body.email });
      if (userExists) {
        const error = new Error("El correo ya esta registrado");
        return res.status(409).json({ error: error.message }); //-> 409 Conflict
      } //HASHEAR PASSWORDS //await pausa la ejecucion de la funcion hasta que se complete el salt

      const salt = await bcrypt.genSalt(10);
      // Genera un salt para encriptar la contraseña antes de hashearla
      //await pausa la ejecucion de la funcion hasta que se complete el hash
      user.password = await bcrypt.hash(req.body.password, salt); // Hashea la contraseña antes de guardarla en la base de datos //GENERAR TOKEN y guardarlo en la base de datos

      const token = new Token();
      const generatedToken = await Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      token.token = generatedToken;
      token.user = user.id; //GUARDAR USUARIO

      //Enviar email
      AuthEmail.sendEmailConfirmation({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      await user.save(); // Guarda el usuario en la base de datos
      await token.save(); // Guarda el token en la base de datos

      res.send("Cuenta creada, revisa tu email para confirmarla");
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Hubo un error creando la cuenta" });
    }
  };

  //CONFIRMAR CUENTA
  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const tokenExists = await Token.findOne({ token: req.body.token });

      if (!tokenExists) {
        return res.status(404).json({ error: "Token no encontrado" });
      }

      const user = await User.findById(tokenExists.user);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      user.confirmed = true;

      await user.save();

      await tokenExists.deleteOne();

      res.send("Cuenta confirmada correctamente");
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Hubo un error confirmando la cuenta" });
    }
  };
}
