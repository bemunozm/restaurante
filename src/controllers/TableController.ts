import type { Request, Response } from 'express';
import Table from '../models/Table';

export class TableController {

    static createTable = async (req: Request, res: Response) => {
        try {

            const table = new Table(req.body);
            await table.save();

            res.status(201).send('Mesa creada exitosamente');
        } catch (error) {
            console.log(error);
            res.status(500).send('Error al crear la mesa');
        }
    }

    static updateTable = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const table = await Table.findByIdAndUpdate(id, updateData, { new: true });

            if (!table) {
                return res.status(404).send('Mesa no encontrada');
            }

            res.status(200).send('Mesa actualizada exitosamente');
        } catch (error) {
            console.log(error);
            res.status(500).send('Error al actualizar la mesa');
        }
    }

    static getTables = async (req: Request, res: Response) => {
        try {
            const tables = await Table.find();
            res.status(200).send(tables);
        } catch (error) {
            console.log(error);
            res.status(500).send('Error al obtener las mesas');
        }
    }

    static getTable = async (req: Request, res: Response) => {
        try {
            const table = await Table.findById(req.params.id);
            if (!table) {
                return res.status(404).send('Mesa no encontrada');
            }
            res.status(200).send(table);
        } catch (error) {
            console.log(error);
            res.status(500).send('Error al obtener la mesa');
        }
    }

    static deleteTable = async (req: Request, res: Response) => {
        try {
            const table = await Table.findByIdAndDelete(req.params.id);
            if (!table) {
                return res.status(404).send('Mesa no encontrada');
            }
            res.status(200).send('Mesa eliminada exitosamente');
        } catch (error) {
            console.log(error);
            res.status(500).send('Error al eliminar la mesa');
        }
    }
}
