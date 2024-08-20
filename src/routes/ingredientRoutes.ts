import { Router } from 'express'
import { body, param } from 'express-validator'
import { handleInputErrors } from '../middleware/validation'
import { authenticate } from '../middleware/auth'
import { IngredientController } from '../controllers/IngredientController'

const router = Router()

// CRUD de ingredientes

// Crear un ingrediente
router.post('/create-ingredient',
    body('name')
        .notEmpty().withMessage('El nombre no puede ir vacío'),
    body('stockQuantity')
        .isInt({ gt: 0 }).withMessage('El stock no puede ser negativo')
        .notEmpty().withMessage('Debes agregar un stcock'),
    body('unit')
        .notEmpty().withMessage('Debes agregar una unidad de medida'),
    authenticate,
    handleInputErrors,
    IngredientController.createIngredient
)

// Obtener todos los ingredientes
router.get('/get-ingredients',
    authenticate,
    handleInputErrors,
    IngredientController.getIngredients
)

// Obtener un ingrediente
router.get('/get-ingredient/:id',
    param('id')
        .isMongoId().withMessage('El ID debe ser un ID de Mongo válido'),
    authenticate,
    handleInputErrors,
    IngredientController.getIngredient
)

// Actualizar un ingrediente
router.post('/update-ingredient/:id',
    param('id')
        .isMongoId().withMessage('El ID debe ser un ID de Mongo válido'),
    body('name')
        .notEmpty().withMessage('El nombre no puede ir vacío'),
    body('stockQuantity')
        .isInt({ gt: 0 }).withMessage('El stock no puede ser negativo')
        .notEmpty().withMessage('Debes agregar un stcock'),
    body('unit')
        .notEmpty().withMessage('Debes agregar una unidad de medida'),
    authenticate,
    handleInputErrors,
    IngredientController.updateIngredient
)

// Eliminar un ingrediente
router.delete('/delete-ingredient/:id',
    param('id')
        .isMongoId().withMessage('El ID debe ser un ID de Mongo válido'),
    authenticate,
    handleInputErrors,
    IngredientController.deleteIngredient
)

export default router