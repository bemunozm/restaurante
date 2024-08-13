import { Router } from "express";

import { AuthController } from "../controllers/AuthController";

import { body } from "express-validator";

import { handleInputErrors } from "../middleware/validation";

const router = Router();

//Aqui iran todas las rutas de autenticacion

router.post(
  "/create-account",
  body("name").notEmpty().withMessage("El nombre es obligatorio"),
  body("password")
    .isLength({ min: 8 })
    .withMessage(
      "El password es obligatorio y debe tener al menos 8 caracteres"
    ),
  body("password_confirmation").custom((value, { req }) => {
    //Si el campo password_confirmation no es igual al campo password, se envia un mensaje de error
    if (value !== req.body.password) {
      throw new Error("Las contraseñas no coinciden");
    }
    return true;
  }),
  body("email").isEmail().withMessage("Agrega un correo valido"),
  handleInputErrors, //Utiliza el middleware para manejar los errores
  AuthController.createAccount //Llama al controlador para loguear al usuario en caso de que no haya errores
);

export default router;
