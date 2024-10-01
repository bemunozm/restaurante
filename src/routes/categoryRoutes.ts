import { Router } from 'express'
import { body, param } from 'express-validator'
import { handleInputErrors } from '../middleware/validation'
import { authenticate } from '../middleware/auth'
import { CategoryController } from '../controllers/CategoryController'
import upload from '../config/multer'
import checkPermission from '../middleware/permission'
import { Permissions } from '../models/Role'

const router = Router()

//CRUD de categorías

//Crear una categoría
router.post(
    '/create-category',
    authenticate, // Solo usuarios autenticados pueden acceder
    checkPermission(Permissions.CREATE_CATEGORY), // Solo administradores pueden crear categorías
    upload.single('image'),
    body('name').notEmpty().withMessage('El nombre no puede ir vacio'),
    handleInputErrors,
    CategoryController.createCategory
);
  

//Obtener todas las categorías
router.get('/get-categories',
    authenticate, // Solo usuarios autenticados pueden acceder
    checkPermission(Permissions.VIEW_CATEGORIES), // Solo administradores pueden ver las categorías
    handleInputErrors,
    CategoryController.getCategories
)

//Obtener una categoría
router.get('/get-category/:id',
    authenticate, // Solo usuarios autenticados pueden acceder
    checkPermission(Permissions.VIEW_CATEGORY), // Solo administradores pueden ver una categoría específica
    param('id').isMongoId().withMessage('El ID debe ser un ID de Mongo válido'),
    handleInputErrors,
    CategoryController.getCategory
)

//Actualizar una categoría
router.post('/update-category/:id',
    authenticate, // Solo usuarios autenticados pueden acceder
    checkPermission(Permissions.UPDATE_CATEGORY), // Solo administradores pueden actualizar categorías
    upload.single('image'),
    param('id').isMongoId().withMessage('El ID debe ser un ID de Mongo válido'),
    body('name').notEmpty().withMessage('El nombre no puede ir vacio'),
    handleInputErrors,
    CategoryController.updateCategory
)

//Eliminar una categoría
router.delete('/delete-category/:id',
    authenticate, // Solo usuarios autenticados pueden acceder
    checkPermission(Permissions.DELETE_CATEGORY), // Solo administradores pueden eliminar categorías
    param('id').isMongoId().withMessage('El ID debe ser un ID de Mongo válido'),
    handleInputErrors,
    CategoryController.deleteCategory
)


export default router