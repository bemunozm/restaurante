import { Router } from 'express'
import { body, param } from 'express-validator'
import { handleInputErrors } from '../middleware/validation'
import { authenticate } from '../middleware/auth'
import { CategoryController } from '../controllers/CategoryController'

const router = Router()

//CRUD de categorías

//Crear una categoría
router.post('/create-category',
    body('name')
        .notEmpty().withMessage('El nombre no puede ir vacio'),
    authenticate,
    handleInputErrors,
    CategoryController.createCategory
)

//Obtener todas las categorías
router.get('/get-categories',
    authenticate,
    handleInputErrors,
    CategoryController.getCategories
)

//Obtener una categoría
router.get('/get-category/:id',
    param('id')
        .isMongoId().withMessage('El ID debe ser un ID de Mongo válido'),
    authenticate,
    handleInputErrors,
    CategoryController.getCategory
)

//Actualizar una categoría
router.post('/update-category/:id',
    param('id')
        .isMongoId().withMessage('El ID debe ser un ID de Mongo válido'),
    body('name')
        .notEmpty().withMessage('El nombre no puede ir vacio'),
    authenticate,
    handleInputErrors,
    CategoryController.updateCategory
)

//Eliminar una categoría
router.delete('/delete-category/:id',
    param('id')
        .isMongoId().withMessage('El ID debe ser un ID de Mongo válido'),
    authenticate,
    handleInputErrors,
    CategoryController.deleteCategory
)

export default router