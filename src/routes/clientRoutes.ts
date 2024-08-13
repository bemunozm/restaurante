import { Router } from "express";
import { ClientController } from "../controllers/ClientController";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

// Validar email y manejar registro/confirmación
router.post(
  "/validate-email",
  body("email").isEmail().withMessage("Agrega un correo válido"),
  handleInputErrors,
  ClientController.validateEmail
);

// Confirmar cuenta del cliente
router.post(
  "/confirm-account",
  body("token").notEmpty().withMessage("El token es obligatorio"),
  handleInputErrors,
  ClientController.confirmAccount
);

export default router;
