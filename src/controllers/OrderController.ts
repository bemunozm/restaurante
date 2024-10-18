// controllers/OrderController.ts

import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import Session from '../models/Session';

export class OrderController {

    static orderProducts = async (req: Request, res: Response) => {
        try {
            const { items, sessionId, tableId, guestId, userId } = req.body; // Recibimos los productos del carrito

            // Verificar que la sesión existe
            const session = await Session.findById(sessionId);
            if (!session) {
                return res.status(404).json({ error: 'Sesión no encontrada' });
            }

            // Verificar que los productos existen
            for (const item of items) {
                const product = await Product.findById(item.productId);
                if (!product) {
                    return res.status(404).json({ error: `Producto no encontrado: ${item.productId}` });
                }
            }

            // Crear la orden
            const newOrder = new Order({
                sessionId,
                tableId,
                guestId: guestId || null,  // Puede ser null si es un usuario registrado
                userId: userId || null,    // Puede ser null si es un invitado
                items,
                status: 'Pendiente',
            });

            // Guardar la orden en la base de datos
            await newOrder.save();

            return res.status(201).json({ message: 'Pedido realizado con éxito', order: newOrder });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Hubo un error al realizar el pedido' });
        }
    };

    static getOrders = async (req: Request, res: Response) => {
        try {
            const orders = await Order.find()
                .populate('tableId', 'tableNumber')  // Popula los detalles de los productos
                .populate('items.productId')  // Popula los detalles de los productos
                .populate('userId', 'name')    // Popula el nombre del usuario (si existe)
                .populate('guestId', 'name');  // Popula el nombre del invitado (si existe)

            if (orders.length === 0) {
                return res.status(404).json({ error: 'No hay órdenes para mostrar' });
            }

            return res.status(200).json(orders);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al obtener las órdenes' });
        }
    }


    static getOrdersBySessionId = async (req: Request, res: Response) => {
        const { sessionId } = req.params;
    
        try {
          // Verificar si la sesión existe
          const session = await Session.findById(sessionId);
          if (!session) {
            return res.status(404).json({ error: 'Sesión no encontrada' });
          }
    
          // Obtener todas las órdenes relacionadas con la sesión
          const orders = await Order.find({ sessionId })
            .populate('items.productId tableId')  // Popula los detalles de los productos
            .populate('userId', 'name')    // Popula el nombre del usuario (si existe)
            .populate('guestId', 'name');  // Popula el nombre del invitado (si existe)
    
          if (orders.length === 0) {
            return res.status(404).json({ error: 'No hay órdenes para esta sesión' });
          }
    
          return res.status(200).json(orders);
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Error al obtener las órdenes' });
        }
      };
      
      static updateOrderItemStatus = async (req: Request, res: Response) => {
        const { itemId } = req.params; // Obtener itemId de los parámetros
        const { status } = req.body;   // Obtener el nuevo estado del cuerpo de la solicitud
      
        // Validar que el estado sea uno de los permitidos
        const allowedStatuses = ['Pendiente', 'En Preparacion', 'Listo', 'Cancelado', 'Entregado'];
        if (!allowedStatuses.includes(status)) {
          return res.status(400).json({ error: 'Estado inválido' });
        }
      
        try {
          // Buscar la orden que contiene el ítem con el itemId
          const order = await Order.findOne({ 'items._id': itemId });
          console.log('Order:', order);
      
          if (!order) {
            return res.status(404).json({ error: 'Orden no encontrada' });
          }
      
          // Buscar el ítem específico dentro de la orden
          const item = order.items.find(item => item._id.toString() === itemId);
          if (!item) {
            return res.status(404).json({ error: 'Ítem no encontrado en la orden' });
          }
      
          // Actualizar el estado del ítem
          item.status = status;
      
          // Guardar la orden actualizada
          await order.save();
      
          return res.status(200).json({ message: 'Estado del ítem actualizado con éxito', order });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Hubo un error al actualizar el estado del ítem' });
        }
      };
      
      //Obtener order por id
      static getOrderById = async (req: Request, res: Response) => {
        const { orderId } = req.params;
      
        try {
          const order = await Order.findById(orderId)
            .populate('tableId', 'tableNumber')  // Popula los detalles de los productos
            .populate('items.productId')  // Popula los detalles de los productos
            .populate('userId', 'name')    // Popula el nombre del usuario (si existe)
            .populate('guestId', 'name');  // Popula el nombre del invitado (si existe)
      
          if (!order) {
            return res.status(404).json({ error: 'Orden no encontrada' });
          }
      
          return res.status(200).json(order);
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Error al obtener la orden' });
        }
      };

      // Obtener las órdenes para la cocina basadas en el estado de la sesión y los estados de los items
    static getOrdersForKitchen = async (req: Request, res: Response) => {
      try {
          // Buscar todas las sesiones activas
          const activeSessions = await Session.find({ status: 'Activa' }).select('_id');
          if (activeSessions.length === 0) {
              return res.status(404).json({ error: 'No hay sesiones activas' });
          }

          // Obtener las órdenes que pertenecen a sesiones activas
          const orders = await Order.find({ sessionId: { $in: activeSessions } })
            .populate('items.productId tableId') // Popula los detalles de los productos
            .sort({ createdAt: 1 }); // Ordenar por la fecha de creación

          // Filtrar los items que tienen los estados 'Pendiente', 'En Preparacion', o 'Listo'
          const filteredOrders = orders.map(order => {
              const filteredItems = order.items.filter(item =>
                  ['Pendiente', 'En Preparacion', 'Listo'].includes(item.status)
              );
              return { ...order.toObject(), items: filteredItems }; // Solo incluir los items que cumplan con el estado
          }).filter(order => order.items.length > 0); // Excluir órdenes sin items válidos

          if (filteredOrders.length === 0) {
              return res.status(404).json({ error: 'No hay órdenes pendientes, en preparación o listas para mostrar' });
          }

          return res.status(200).json(filteredOrders);
      } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Hubo un error al obtener los pedidos para la cocina' });
      }
  };

  // Obtener las órdenes por usuario
static getOrdersByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ userId })
      .populate('tableId')    // Popula los detalles de la mesa
      .populate('userId')     // Popula los detalles del usuario
      .populate('guestId')    // Popula el invitado, si existe
      .populate('items.productId');  // Popula los detalles de los productos

    if (orders.length === 0) {
      return res.status(404).json({ error: 'No hay órdenes para mostrar' });
    }

    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener las órdenes' });
  }
}

        
}
