import { Router } from 'express'
import { body, param } from 'express-validator'
import { handleInputErrors } from '../middleware/validation'
import { authenticate } from '../middleware/auth'
import { IngredientController } from '../controllers/IngredientController'
import upload from '../config/multer'
import checkPermission from '../middleware/permission'
import { Permissions } from '../models/Role'

const router = Router()

// CRUD de ingredientes

// Crear un ingrediente
router.post('/create-ingredient',
    authenticate, // Solo usuarios autenticados pueden acceder
    checkPermission(Permissions.CREATE_INGREDIENT), // Solo administradores pueden crear ingredientes
    upload.single('image'),
    body('name').notEmpty().withMessage('El nombre no puede ir vacío'),
    body('stockQuantity')
        .isInt({ gt: 0 }).withMessage('El stock no puede ser negativo')
        .notEmpty().withMessage('Debes agregar un stock'),
    body('unit').notEmpty().withMessage('Debes agregar una unidad de medida'),
    handleInputErrors,
    IngredientController.createIngredient
)

// Obtener todos los ingredientes
router.get('/get-ingredients',
    authenticate, // Solo usuarios autenticados pueden acceder
    checkPermission(Permissions.VIEW_INGREDIENTS), // Solo administradores pueden ver los ingredientes
    handleInputErrors,
    IngredientController.getIngredients
)

// Obtener un ingrediente
router.get('/get-ingredient/:id',
    authenticate, // Solo usuarios autenticados pueden acceder
    checkPermission(Permissions.VIEW_INGREDIENT), // Solo administradores pueden ver un ingrediente específico
    param('id').isMongoId().withMessage('El ID debe ser un ID de Mongo válido'),
    handleInputErrors,
    IngredientController.getIngredient
)

// Actualizar un ingrediente
router.post('/update-ingredient/:id',
    authenticate, // Solo usuarios autenticados pueden acceder
    checkPermission(Permissions.UPDATE_INGREDIENT), // Solo administradores pueden actualizar ingredientes
    upload.single('image'),
    param('id').isMongoId().withMessage('El ID debe ser un ID de Mongo válido'),
    body('name').notEmpty().withMessage('El nombre no puede ir vacío'),
    body('stockQuantity')
        .isInt({ gt: 0 }).withMessage('El stock no puede ser negativo')
        .notEmpty().withMessage('Debes agregar un stock'),
    body('unit').notEmpty().withMessage('Debes agregar una unidad de medida'),
    handleInputErrors,
    IngredientController.updateIngredient
    )

// Eliminar un ingrediente
router.delete('/delete-ingredient/:id',
    authenticate, // Solo usuarios autenticados pueden acceder
    checkPermission(Permissions.DELETE_INGREDIENT), // Solo administradores pueden eliminar ingredientes
    param('id').isMongoId().withMessage('El ID debe ser un ID de Mongo válido'),
    handleInputErrors,
    IngredientController.deleteIngredient
)

export default router