import { Router } from 'express'
import { body, param } from 'express-validator'
import { handleInputErrors } from '../middleware/validation'
import { authenticate } from '../middleware/auth'
import { TableController } from '../controllers/TableController'
import checkPermission from '../middleware/permission'
import { Permissions } from '../models/Role'

const router = Router()

// CRUD de mesas

// Crear una mesa
router.post('/create-table',
    authenticate, // Solo usuarios autenticados pueden acceder
    checkPermission(Permissions.CREATE_TABLE), // Solo 'Administrador'es o personal autorizado puede crear mesas
    body('tableNumber').notEmpty().withMessage('Asigna un número de mesa único')
        .isNumeric().withMessage('El número de mesa debe ser un número'),
    handleInputErrors,
    TableController.createTable
)

// Obtener todas las mesas
router.get('/get-tables',
    // authenticate,
    handleInputErrors,
    TableController.getTables
)

// Obtener una mesa
router.get('/get-table/:id',
    param('id')
        .isMongoId().withMessage('El ID debe ser un ID de Mongo válido'),
    // authenticate,
    handleInputErrors,
    TableController.getTable
)

// Actualizar una mesa
router.post('/update-table/:id',
    authenticate, // Solo usuarios autenticados pueden acceder
    checkPermission(Permissions.UPDATE_TABLE), // Solo 'Administrador'es o personal autorizado puede actualizar mesas
    param('id').isMongoId().withMessage('El ID debe ser un ID de Mongo válido'),
    body('tableNumber').optional().isNumeric().withMessage('El número de mesa debe ser un número'),
    handleInputErrors,
    TableController.updateTable
)

// Eliminar una mesa
router.delete('/delete-table/:id',
    authenticate, // Solo usuarios autenticados pueden acceder
    checkPermission(Permissions.DELETE_TABLE), // Solo 'Administrador'es o personal autorizado puede eliminar mesas
    param('id').isMongoId().withMessage('El ID debe ser un ID de Mongo válido'),
    handleInputErrors,
    TableController.deleteTable
)

export default router;
