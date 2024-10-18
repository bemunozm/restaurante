import { Router } from "express";
import { OrderController } from "../controllers/OrderController";
import { param } from "express-validator";

const router = Router();

// Rutas para la cocina (mover esta ruta arriba)
router.get('/orders/kitchen', 
    OrderController.getOrdersForKitchen
);

// CRUD de órdenes
router.post('/create-order', 
    OrderController.orderProducts
);

router.get('/orders', 
    OrderController.getOrders
);

router.get('/orders/:sessionId', 
    OrderController.getOrdersBySessionId
);

// Obtener order por id
router.get('/id/:orderId', 
    OrderController.getOrderById
);

// Actualizar estado de un item de la orden
router.put('/:itemId/status', 
    OrderController.updateOrderItemStatus
);

// Obtener order por usuario
router.get('/user/:userId', 
    OrderController.getOrdersByUserId
);

export default router;
