import { Router } from "express";
import { SessionController } from "../controllers/SessionController";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

// Crear sesión
router.post(
  "/create-session",
  body("email").isEmail().withMessage("Agrega un correo válido"),
  body("tableNumber").isNumeric().withMessage("El número de mesa es obligatorio"),
  handleInputErrors,
  SessionController.createSession
);

// Unirse a una sesión
router.post(
  "/join-session",
  body("email").isEmail().withMessage("Agrega un correo válido"),
  body("tableNumber").isNumeric().withMessage("El número de mesa es obligatorio"),
  body("sessionToken").notEmpty().withMessage("El token de sesión es obligatorio"),
  handleInputErrors,
  SessionController.joinSession
);

// Cerrar sesión
router.post(
  "/close-session",
  body("tableNumber").isNumeric().withMessage("El número de mesa es obligatorio"),
  handleInputErrors,
  SessionController.closeSession
);

export default router;
