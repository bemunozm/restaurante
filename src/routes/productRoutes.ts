import { Router } from 'express'
import { body, param } from 'express-validator'
import { handleInputErrors } from '../middleware/validation'
import { authenticate } from '../middleware/auth'
import Product from '../models/Product'
import { ProductController } from '../controllers/ProductController'
import upload from '../config/multer'

const router = Router()

//CRUD de productos

//Crear un producto
router.post('/create-product',
    upload.single('image'),
    body('name')
        .notEmpty().withMessage('El nombre no puede ir vacio'),
    body('price')
        .isInt({ gt: 0 }).withMessage('El precio debe ser un número entero positivo')
        .notEmpty().withMessage('El precio no puede estar vacío'),
    // body('image')
    //     .notEmpty().withMessage('La imagen no puede estar vacía'),
    body('categoryId')
        .isMongoId().withMessage('La categoría debe ser un ID de Mongo válido')
         .notEmpty().withMessage('La categoría no puede estar vacía'),
     body('ingredients')
         .isArray().withMessage('Los ingredientes deben ser un arreglo'), 
    // authenticate,
    handleInputErrors,
    ProductController.createProduct
)

//Obtener todos los productos
router.get('/get-products',
    authenticate,
    handleInputErrors,
    ProductController.getProducts
)

//Obtener un producto
router.get('/get-product/:id',
    param('id')
        .isMongoId().withMessage('El ID debe ser un ID de Mongo válido'),
    authenticate,
    handleInputErrors,
    ProductController.getProduct
)

//Actualizar un producto
router.post('/update-product/:id',
    param('id')
        .isMongoId().withMessage('El ID debe ser un ID de Mongo válido'),
        body('name')
        .notEmpty().withMessage('El nombre no puede ir vacio'),
    body('price')
        .isInt({ gt: 0 }).withMessage('El precio debe ser un número entero positivo')
        .notEmpty().withMessage('El precio no puede estar vacío'),
     body('categoryId')
         .isMongoId().withMessage('La categoría debe ser un ID de Mongo válido')
         .notEmpty().withMessage('La categoría no puede estar vacía'),
     body('ingredients')
         .isArray().withMessage('Los ingredientes deben ser un arreglo'), 
    authenticate,
    handleInputErrors,
    ProductController.updateProduct
)

//Eliminar un producto
router.delete('/delete-product/:id',
    param('id')
        .isMongoId().withMessage('El ID debe ser un ID de Mongo válido'),
    authenticate,
    handleInputErrors,
    ProductController.deleteProduct
)


export default router