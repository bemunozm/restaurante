import { Router } from "express";

import { AuthController } from "../controllers/AuthController";

import { body, param } from "express-validator";

import { handleInputErrors } from "../middleware/validation";

const router = Router();

//Aqui iran todas las rutas de autenticacion

//Crear cuenta
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

//Confirmar cuenta
router.post(
  "/confirm-account",
  body("token").notEmpty().withMessage("El token es obligatorio"),
  handleInputErrors,
  AuthController.confirmAccount
);

//Iniciar sesion
router.post(
  "/login",

  body("email").isEmail().withMessage("Agrega un correo valido"),

  body("password").notEmpty().withMessage("El password es obligatorio"),

  handleInputErrors,

  AuthController.login
);

//SOLICITAR NUEVO CODIGO DE CONFIRMACION
router.post(
  "/request-code",

  body("email").isEmail().withMessage("Agrega un correo valido"),

  handleInputErrors,

  AuthController.requestConfirmationCode
);

//REESTABLECER CONTRASEÑA
router.post(
  "/forgot-password",

  body("email").isEmail().withMessage("Agrega un correo valido"),

  handleInputErrors,

  AuthController.forgotPassword
);

//VALIDAR TOKEN
router.post(
  "/validate-token",

  body("token").notEmpty().withMessage("El token es obligatorio"),

  handleInputErrors,

  AuthController.validateToken
);

//ACTUALIZAR CONTRASEÑA
router.post(
  "/update-password/:token",

  param("token").isNumeric().withMessage("Token no valido"),

  body("password")
    .isLength({ min: 8 })
    .withMessage(
      "El password es obligatorio y debe tener al menos 8 caracteres"
    ) /*
    
        value = es el valor que se esta enviando el usuario en el campo password_confirmation
    
        req = es la request que se esta enviando. Sirve para poder compararlo con otro campo (en este caso password)
    
        */,

  body("password_confirmation").custom((value, { req }) => {
    //Si el campo password_confirmation no es igual al campo password, se envia un mensaje de error

    if (value !== req.body.password) {
      throw new Error("Las contraseñas no coinciden");
    }

    return true;
  }),

  handleInputErrors,

  AuthController.updatePasswordWithToken
);

export default router;
