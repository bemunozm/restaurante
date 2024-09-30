import type { Request, Response } from 'express';
import Product from '../models/Product';
import upload from '../config/multer';
import Category from '../models/Category';


export class ProductController {

    static createProduct = async (req: Request, res: Response) => {
        try {
            // Si es necesario, convierte los campos a su tipo correcto.
            const { name, price, about, categoryId, ingredients } = req.body;

            const productData = {
                name,
                price: parseInt(price), // Asegurando que el precio sea un número
                about,
                categoryId,
                ingredients: ingredients, // Convertimos los ingredientes a un array de objetos
            };

            if (req.file) {
                productData['image'] = `/uploads/images/${req.file.filename}`;
            }

            const product = new Product(productData);
            await product.save();

            res.status(201).json({ message: 'Producto creado exitosamente', product });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al crear el producto');
        }
    }


    static getProducts = async (req: Request, res: Response) => {

        try {
            const products = await Product.find().populate('categoryId', 'name _id')
            res.status(200).send(products);
        } catch (error) {
            console.log(error);
            res.status(500).send('Error al obtener los productos');
        }
    }

    static getProduct = async (req: Request, res: Response) => {

        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(404).send('Producto no encontrado');
            }
            res.status(200).send(product);
        } catch (error) {
            console.log(error);
            res.status(500).send('Error al obtener el producto');
        }
    }

    static updateProduct = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
    
            // Verificar si se envió una nueva imagen
            if (req.file) {
                updateData.image = `/uploads/images/${req.file.filename}`; // Actualiza la ruta de la imagen
            }
    
            // Asegurar que ciertos campos sean del tipo correcto
            if (updateData.price) {
                updateData.price = parseInt(updateData.price); // Asegurar que el precio sea un número
            }
    
            // Si es necesario, realiza otras conversiones o validaciones aquí
    
            const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
            
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
    
            res.status(200).json({ message: 'Producto actualizado exitosamente', product });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al actualizar el producto' });
        }
    }

    static deleteProduct = async (req: Request, res: Response) => {

        try {
            const product = await Product.findByIdAndDelete(req.params.id);
            if (!product) {
                return res.status(404).send('Producto no encontrado');
            }
            res.status(200).send('Producto eliminado exitosamente');
        } catch (error) {
            console.log(error);
            res.status(500).send('Error al eliminar el producto');
        }
    }

    static getProductsByCategory = async (req: Request, res: Response) => {
    try {
        let category;

        if (req.params.categoryName) {
            category = await Category.findOne({ name: req.params.categoryName });
        } else {
            category = await Category.findOne();
        }

        if (!category) {
            return res.status(404).send('Categoría no encontrada');
        }

        const products = await Product.find({ categoryId: category._id });
        res.status(200).send(products);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al obtener los productos');
    }
}
}