import type { Request, Response } from 'express';
import Ingredient from '../models/Ingredient';

export class IngredientController {

    static createIngredient = async (req: Request, res: Response) => {
        try {
            const { name, stockQuantity, unit } = req.body;
            
            const ingredientData: any = {
                name,
                stockQuantity,
                unit,
            };

            // Verifica si hay un archivo de imagen en la solicitud
            if (req.file) {
                ingredientData.image = `/uploads/images/${req.file.filename}`;
            }

            const ingredient = new Ingredient(ingredientData);
            await ingredient.save();

            res.status(201).send('Ingrediente creado exitosamente');
        } catch (error) {
            console.log(error);
            res.status(500).send('Error al crear el ingrediente');
        }
    }

    static updateIngredient = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const updateData = req.body;

            // Verifica si se envió una nueva imagen
            if (req.file) {
                updateData.image = `/uploads/images/${req.file.filename}`;
            }

            const ingredient = await Ingredient.findByIdAndUpdate(id, updateData, { new: true });

            if (!ingredient) {
                return res.status(404).send('Ingrediente no encontrado');
            }

            res.status(200).send('Ingrediente actualizado exitosamente');
        } catch (error) {
            console.log(error);
            res.status(500).send('Error al actualizar el ingrediente');
        }
    }

    // Los otros métodos permanecen sin cambios
    static getIngredients = async (req: Request, res: Response) => {
        try {
            const ingredients = await Ingredient.find();
            res.status(200).send(ingredients);
        } catch (error) {
            console.log(error);
            res.status(500).send('Error al obtener los ingredientes');
        }
    }

    static getIngredient = async (req: Request, res: Response) => {
        try {
            const ingredient = await Ingredient.findById(req.params.id);
            if (!ingredient) {
                return res.status(404).send('Ingrediente no encontrado');
            }
            res.status(200).send(ingredient);
        } catch (error) {
            console.log(error);
            res.status(500).send('Error al obtener el ingrediente');
        }
    }

    static deleteIngredient = async (req: Request, res: Response) => {
        try {
            const ingredient = await Ingredient.findByIdAndDelete(req.params.id);
            if (!ingredient) {
                return res.status(404).send('Ingrediente no encontrado');
            }
            res.status(200).send('Ingrediente eliminado exitosamente');
        } catch (error) {
            console.log(error);
            res.status(500).send('Error al eliminar el ingrediente');
        }
    }
}
