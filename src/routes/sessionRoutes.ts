import { Router } from 'express';
import { body, param } from 'express-validator';
import { handleInputErrors } from '../middleware/validation';
import SessionController from '../controllers/SessionController';
import { authenticateGuest} from "../middleware/auth";

const router = Router();

// Crear una nueva sesión
router.post('/create-session',
    body('tableId')
        .isMongoId().withMessage('El ID de la mesa debe ser un ID de Mongo válido'),
    // authenticate,
    handleInputErrors,
    SessionController.createSession
);

// Obtener todas las sesiones
router.get('/get-sessions',
    // authenticate,
    handleInputErrors,
    SessionController.getAllSessions
);

// Obtener una sesión por ID
router.get('/get-session/:id',
    param('id')
        .isMongoId().withMessage('El ID debe ser un ID de Mongo válido'),
    // authenticate,
    handleInputErrors,
    SessionController.getSessionById
);

// Actualizar una sesión (cerrar sesión)
router.post('/update-session/:id',
    param('id')
        .isMongoId().withMessage('El ID debe ser un ID de Mongo válido'),
    // authenticate,
    handleInputErrors,
    SessionController.updateSession
);

// Eliminar una sesión
router.delete('/delete-session/:id',
    param('id')
        .isMongoId().withMessage('El ID debe ser un ID de Mongo válido'),
    // authenticate,
    handleInputErrors,
    SessionController.deleteSession
);

// Agregar un cliente a una sesión existente
router.post('/add-guest/:sessionId',
    param('sessionId')
        .isMongoId().withMessage('El ID de la sesión debe ser un ID de Mongo válido'),
    body('guestName')
        .notEmpty().withMessage('El nombre del invitado no puede ir vacío'),
    // authenticate,
    handleInputErrors,
    SessionController.addGuestToSession
);

// Validar el token de la session
router.post('/validate-token',
    body('token')
        .notEmpty().withMessage('Debes cargar un Token para validar'),
    // authenticate,
    handleInputErrors,
    SessionController.validateToken
);

// Comprobar si ya existe una sesión para la mesa
router.get('/get-session-by-table/:tableId',
    param('tableId')
        .isMongoId().withMessage('El ID de la mesa debe ser un ID de Mongo válido'),
    // authenticate,
    handleInputErrors,
    SessionController.checkSessionExists
);

//Authenticar un cliente
router.get('/guest',
    authenticateGuest,
    SessionController.authenticateGuest
)
export default router;
