import type { Request, Response } from 'express';
import Product from '../models/Product';


export class ProductController {

    static createProduct = async (req: Request, res: Response) => {

        try {
            const product = new Product(req.body);
            await product.save();
            res.status(201).send('Producto creado exitosamente');
        } catch (error) {
            console.log(error);
            res.status(500).send('Error al crear el producto');
        }
    }

    static getProducts = async (req: Request, res: Response) => {

        try {
            const products = await Product.find();
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