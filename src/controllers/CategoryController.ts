import type { Request, Response } from 'express';
import User from '../models/User';
import Category from '../models/Category';

export class CategoryController {

    static createCategory = async (req: Request, res: Response) => {
        try {
            const category = new Category(req.body);
            await category.save();
            res.status(201).send('Categoría creada exitosamente');
        } catch (error) {
            console.log(error);
            res.status(500).send('Error al crear la categoría');
        }
    }

    static getCategories = async (req: Request, res: Response) => {
        try {
            const categories = await Category.find();
            res.status(200).send(categories);
        } catch (error) {
            console.log(error);
            res.status(500).send('Error al obtener las categorías');
        }
    }

    static getCategory = async (req: Request, res: Response) => {
        try {
            const category = await Category.findById(req.params.id);
            if (!category) {
                return res.status(404).send('Categoría no encontrada');
            }
            res.status(200).send(category);
        } catch (error) {
            console.log(error);
            res.status(500).send('Error al obtener la categoría');
        }
    }

    static updateCategory = async (req: Request, res: Response) => {
        try {
            const category = await Category.findByIdAndUpdate(req.params.id, req.body);
            if (!category) {
                return res.status(404).send('Categoría no encontrada');
            }
            res.status(200).send('Categoría actualizada exitosamente');
        } catch (error) {
            console.log(error);
            res.status(500).send('Error al actualizar la categoría');
        }
    }

    static deleteCategory = async (req: Request, res: Response) => {
        try {
            const category = await Category.findByIdAndDelete(req.params.id);
            if (!category) {
                return res.status(404).send('Categoría no encontrada');
            }
            res.status(200).send('Categoría eliminada exitosamente');
        } catch (error) {
            console.log(error);
            res.status(500).send('Error al eliminar la categoría');
        }
    }
}