import type { Request, Response } from 'express';
import Product from '../models/Product';
import upload from '../config/multer';


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
            const product = await Product.findByIdAndUpdate(req.params.id, req.body)
            if (!product) {
                return res.status(404).send('Producto no encontrado');
            }
            res.status(200).send('Producto actualizado exitosamente');
        } catch (error) {
            console.log(error);
            res.status(500).send('Error al actualizar el producto');
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
}