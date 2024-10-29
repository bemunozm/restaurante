import { Router } from 'express'
import { TransbankController } from '../controllers/TransbankController'

const router = Router()

// CRUD de transbank

// Crear una mesa
router.post('/create-transaction',
    TransbankController.createTransaction
)

// Confirmar una transacción
router.post('/confirm-transaction',
    TransbankController.confirmTransaction
)

// Cambiar el estado de una transacción
router.post('/update-transaction-status',
    TransbankController.updateTransactionStatus
)

export default router;
