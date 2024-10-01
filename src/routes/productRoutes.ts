import { Router } from 'express'
import { body, param } from 'express-validator'
import { handleInputErrors } from '../middleware/validation'
import { authenticate } from '../middleware/auth'
import Product from '../models/Product'
import { ProductController } from '../controllers/ProductController'
import upload from '../config/multer'
import checkPermission from '../middleware/permission'
import { Permissions } from '../models/Role'

const router = Router()

//CRUD de productos

//Crear un producto
router.post('/create-product',
    authenticate, // Solo usuarios autenticados pueden acceder
    checkPermission(Permissions.CREATE_PRODUCT), // Solo administradores pueden crear productos
    upload.single('image'),
    body('name').notEmpty().withMessage('El nombre no puede ir vacío'),
    body('price')
        .isInt({ gt: 0 }).withMessage('El precio debe ser un número entero positivo')
        .notEmpty().withMessage('El precio no puede estar vacío'),
    body('categoryId')
        .isMongoId().withMessage('La categoría debe ser un ID de Mongo válido')
        .notEmpty().withMessage('La categoría no puede estar vacía'),
    body('ingredients').isArray().withMessage('Los ingredientes deben ser un arreglo'),
    handleInputErrors,
    ProductController.createProduct
)

//Obtener todos los productos
router.get('/get-products',
    authenticate,
    checkPermission(Permissions.VIEW_PRODUCTS),
    handleInputErrors,
    ProductController.getProducts
)

//Obtener un producto
router.get('/get-product/:id',
    authenticate,
    checkPermission(Permissions.VIEW_PRODUCT),
    param('id').isMongoId().withMessage('El ID debe ser un ID de Mongo válido'),
    handleInputErrors,
    ProductController.getProduct
)

//Actualizar un producto
router.post('/update-product/:id',
    authenticate, // Solo usuarios autenticados pueden acceder
    checkPermission(Permissions.UPDATE_PRODUCT), // Solo administradores pueden actualizar productos
    upload.single('image'),
    param('id').isMongoId().withMessage('El ID debe ser un ID de Mongo válido'),
    body('name').notEmpty().withMessage('El nombre no puede ir vacío'),
    body('price')
        .isInt({ gt: 0 }).withMessage('El precio debe ser un número entero positivo')
        .notEmpty().withMessage('El precio no puede estar vacío'),
    body('categoryId')
        .isMongoId().withMessage('La categoría debe ser un ID de Mongo válido')
        .notEmpty().withMessage('La categoría no puede estar vacía'),
    body('ingredients').isArray().withMessage('Los ingredientes deben ser un arreglo'),
    handleInputErrors,
    ProductController.updateProduct
)

//Eliminar un producto
router.delete('/delete-product/:id',
    authenticate, // Solo usuarios autenticados pueden acceder
    checkPermission(Permissions.DELETE_PRODUCT), // Solo administradores pueden eliminar productos
    param('id').isMongoId().withMessage('El ID debe ser un ID de Mongo válido'),
    handleInputErrors,
    ProductController.deleteProduct
)

//Obtener productos por categoría
router.get('/get-products-by-category/:categoryName?',
    authenticate,
    checkPermission(Permissions.VIEW_PRODUCTS),
    handleInputErrors,
    ProductController.getProductsByCategory
)

export default router