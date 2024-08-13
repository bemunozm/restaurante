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

  //INICIAR SESION
  static login = async (req: Request, res: Response) => {
    try {
      //VALIDAR QUE EL USUARIO EXISTA
      const user = await User.findOne({ email: req.body.email }); //SI EL USUARIO NO EXISTE

      if (!user) {
        const error = new Error("Usuario no encontrado");
        return res.status(404).json({ error: error.message });
      } //VALIDAR QUE EL USUARIO HAYA CONFIRMADO SU CUENTA

      if (!user.confirmed) {
        //REENVIAR EMAIL DE CONFIRMACION

        //Generar un nuevo token
        const token = new Token();
        token.user = user.id;
        token.token = Math.floor(100000 + Math.random() * 900000).toString(); //lo guarda en bd

        await token.save(); //enviar email

        AuthEmail.sendEmailConfirmation({
          email: user.email,
          name: user.name,
          token: token.token,
        });

        const error = new Error(
          "La cuenta no ha sido confirmada, hemos enviado un e-mail de confirmacion a tu correo"
        );
        return res.status(401).json({ error: error.message });
      } //VALIDAR QUE EL PASSWORD SEA CORRECTO

      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      ); //SI EL PASSWORD NO ES CORRECTO

      if (!validPassword) {
        const error = new Error("Contraseña incorrecta");
        return res.status(401).json({ error: error.message });
      }

      res.send("Usuario logueado correctamente");
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Hubo un error confirmando la cuenta" });
    }
  };

  //SOLICITAR NUEVO CODIGO DE CONFIRMACION
  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      const user = await User.findOne({ email: req.body.email }); //VALIDAR QUE EL EMAIL NO ESTE REPETIDO

      const userExists = await User.findOne({ email: req.body.email });

      if (!userExists) {
        const error = new Error("El usuario no esta registrado");

        return res.status(409).json({ error: error.message }); //-> 409 Conflict
      }

      if (user.confirmed) {
        const error = new Error("La cuenta ya esta confirmada");

        return res.status(409).json({ error: error.message }); //-> 409 Conflict
      } //GENERAR TOKEN

      const token = new Token();

      const generatedToken = await Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      token.token = generatedToken;

      token.user = user.id; //Enviar email

      AuthEmail.sendEmailConfirmation({
        email: user.email,
        name: user.name,
        token: token.token,
      }); //GUARDAR USUARIO

      await user.save(); // Guarda el usuario en la base de datos

      await token.save(); // Guarda el token en la base de datos

      res.send("Se envio un nuevo token a tu e-mail");
    } catch (error) {
      console.log(error);

      res.status(500).json({ error: "Hubo un error creando la cuenta" });
    }
  };

  //RESTABLECER CONTRASEÑA
  static forgotPassword = async (req: Request, res: Response) => {
    try {
      const user = await User.findOne({ email: req.body.email }); //VALIDAR QUE EL EMAIL NO ESTE REPETIDO

      if (!user) {
        const error = new Error("El usuario no esta registrado");

        return res.status(409).json({ error: error.message }); //-> 409 Conflict
      } //GENERAR TOKEN

      const token = new Token();

      const generatedToken = await Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      token.token = generatedToken;

      token.user = user.id; //Enviar email

      AuthEmail.sendPasswordResetToken({
        email: user.email,
        name: user.name,
        token: token.token,
      }); //GUARDAR USUARIO

      await user.save(); // Guarda el usuario en la base de datos

      await token.save(); // Guarda el token en la base de datos

      res.send("Se envio un nuevo token a tu e-mail");
    } catch (error) {
      console.log(error);

      res.status(500).json({ error: "Hubo un error creando la cuenta" });
    }
  };

  //VALIDAR TOKEN
  static validateToken = async (req: Request, res: Response) => {
    try {
      const tokenExists = await Token.findOne({ token: req.body.token });

      if (!tokenExists) {
        return res.status(404).json({ error: "Token no encontrado" });
      }

      res.send("Token validado, puedes cambiar tu contraseña");
    } catch (error) {
      console.log(error);

      res.status(500).json({ error: "Hubo un error validando el token" });
    }
  };

  //ACTUALIZAR CONTRASEÑA
  static updatePasswordWithToken = async (req: Request, res: Response) => {
    try {
      const tokenExists = await Token.findOne({ token: req.params.token });

      if (!tokenExists) {
        return res.status(404).json({ error: "Token no encontrado" });
      }

      const user = await User.findById(tokenExists.user);

      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      } //HASHEAR PASSWORDS //await pausa la ejecucion de la funcion hasta que se complete el salt

      const salt = await bcrypt.genSalt(10); // Genera un salt para encriptar la contraseña antes de hashearla //await pausa la ejecucion de la funcion hasta que se complete el hash

      user.password = await bcrypt.hash(req.body.password, salt); // Hashea la contraseña antes de guardarla en la base de datos

      user.save();

      tokenExists.deleteOne();

      res.send("El password se modifico correctamente");
    } catch (error) {
      console.log(error);

      res.status(500).json({ error: "Hubo un error actualizando la pass" });
    }
  }
  
}
