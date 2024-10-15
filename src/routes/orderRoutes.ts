import { Router } from "express";
import { OrderController } from "../controllers/OrderController";


const router = Router()

// CRUD de ordenes
router.post('/create-order',
    OrderController.orderProducts
)

router.get('/orders/:sessionId',
    OrderController.getOrdersBySessionId
)

//Rutas para la cocina
router.get('/kitchen',
    OrderController.getOrdersForKitchen
)

//Actualizar estado de un item de la orden
router.put('/:itemId/status', 
    OrderController.updateOrderItemStatus
);


export default router;