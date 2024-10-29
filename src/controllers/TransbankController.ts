import type { Request, Response } from 'express';
import { Environment, IntegrationApiKeys, IntegrationCommerceCodes, Options, WebpayPlus } from 'transbank-sdk';
import Transaction from '../models/Transaction';
import Order from '../models/Order';
import Session from '../models/Session';

export class TransbankController {
    // Crear una transacción

    static createTransaction = async (req: Request, res: Response) => {

        try {

            //Extraer los datos de la petición
            const { amount, sessionId, orders } = req.body

            //Crear la Transaction vacia para obtener su id
            const newTransaction = new Transaction({
                token: '',
                sessionId,
                orders: orders,
                amount,
            });

            await newTransaction.save();

            // Obtener el id de la transacción creada
            const transactionId = newTransaction._id;

            console.log(transactionId);

            // Crear una transacción
            const transaction = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));

            //Hacer la petición a Transbank
            const response = await transaction.create(transactionId.toString(), sessionId, amount,'http://localhost:5173/transaction-result');

            //Actualizar el token de la transacción con el token de Transbank
            await Transaction.updateOne(
                { _id: transactionId },
                { $set: { token: response.token } }
            );


            //Actualizar el estado de la sesión a "Pagando"
            await Session.updateOne(
                { _id: sessionId },
                { $set: { status: 'Pagando' } }
            );

            //Enviar la respuesta de Transbank al frontend
            res.status(200).json(response);
        
        } catch (error) {
            console.log(error);
        }
        
    }

    static confirmTransaction = async (req: Request, res: Response) => {
        try {
            // Extraer el token de la petición
            const { token } = req.body;
    
            // Crear una transacción con WebpayPlus para confirmar el pago
            const transaction = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));
    
            // Confirmar la transacción en Transbank
            const response = await transaction.commit(token);
    
            // Buscar la transacción en la base de datos por su token
            const transactionDB = await Transaction.findOne({ token }).populate('orders');
            
            if (!transactionDB) {
                return res.status(404).json({ error: 'Transacción no encontrada' });
            }
            if (transactionDB.status === 'CONFIRMADA') {
                return res.status(409).json({ error: 'Transacción ya confirmada' });
            }
    
            // Actualizar el estado de las órdenes relacionadas a "Pagado"
    
            await Order.updateMany(
                { _id: { $in: transactionDB.orders } }, // Seleccionar todas las órdenes vinculadas
                { $set: { status: 'Pagado' } } // Actualizar el estado de las órdenes
            );

            // Verificar si todas las ordenes de la sesión están pagadas
            const sessionOrders = await Order.find({ sessionId: transactionDB.sessionId });

            const allOrdersPaid = sessionOrders.every((order) => order.status === 'Pagado');

            // Si todas las órdenes están pagadas, actualizar el estado de la sesión a "Pagada"
            if (allOrdersPaid) {
                await Session.updateOne(
                    { _id: transactionDB.sessionId },
                    { $set: { status: 'Finalizada', endedAt: new Date()} }
                );
            } else {
                // Si no todas las órdenes están pagadas, actualizar el estado de la sesión a "Pagando"
                await Session.updateOne(
                    { _id: transactionDB.sessionId },
                    { $set: { status: 'Activa' } }
                );
            }

            // Actualizar el estado de la transacción a "CONFIRMADA"
            transactionDB.status = 'CONFIRMADA';
            await transactionDB.save();
    
            // Enviar la respuesta al frontend
            res.status(200).json(response);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error confirmando la transacción' });
        }
    }

    static updateTransactionStatus = async (req: Request, res: Response) => {
        try {
            // Extraer el id de la transacción y el nuevo estado
            const { transactionId, status } = req.body;

            console.log(transactionId, status);
    
            // Buscar la transacción en la base de datos
            const transaction = await Transaction.findById(transactionId);
    
            if (!transaction) {
                return res.status(404).json({ error: 'Transacción no encontrada' });
            }

            if (status === 'ANULADA') {
                const session = await Session.findById(transaction.sessionId);
                if (session) {
                    await Session.updateOne(
                        { _id: session._id },
                        { $set: { status: 'Activa' } }
                    );
                }
            }

            // Actualizar el estado de la transacción
            transaction.status = status;
            await transaction.save();

            // Enviar la respuesta al frontend
            res.status(200).json(transaction);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error actualizando la transacción' });
        }
    }
    
}