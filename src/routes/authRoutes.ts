import { Router } from 'express'
import { body, check, param } from 'express-validator'
import { AuthController } from '../controllers/AuthController'
import { handleInputErrors } from '../middleware/validation'
import { authenticate } from '../middleware/auth'
import checkPermission from '../middleware/permission'
import { Permissions } from '../models/Role'

const router = Router()

router.post('/create-account',
    body('name')
        .notEmpty().withMessage('El nombre no puede ir vacio'),
    body('lastname')
        .notEmpty().withMessage('El apellido no puede ir vacio'),
    body('password')
        .isLength({ min: 8 }).withMessage('El password es muy corto, minimo 8 caracteres'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Los Password no son iguales')
        }
        return true
    }),
    body('email')
        .isEmail().withMessage('E-mail no válido'),
    handleInputErrors,
    AuthController.createAccount
)
//Crear cuenta por el 'Administrador'
router.post('/create-account-admin',
    // authenticate,
    // checkPermission(Permissions.CREATE_USER_ACCOUNT_ADMIN),
    body('name')
        .notEmpty().withMessage('El nombre no puede ir vacio'),
    body('lastname')
        .notEmpty().withMessage('El apellido no puede ir vacio'),
    body('email')
        .isEmail().withMessage('E-mail no válido'),
    body('roles')
        .isArray().withMessage('Los roles deben ser un arreglo')
        .notEmpty().withMessage('Los roles no pueden ir vacios'),
    handleInputErrors,
    AuthController.createAccountByAdmin
)

router.delete('/delete-user/:id',
    param('id')
        .isMongoId().withMessage('El ID debe ser un número'),
    handleInputErrors,
    authenticate,
    AuthController.deleteUserById
)

router.get('/get-user/:id',
    param('id')
        .isMongoId().withMessage('El ID debe ser un número'),
    handleInputErrors,
    authenticate,
    AuthController.getUserById
)

router.put('/update-user/:id',
    param('id')
        .isMongoId().withMessage('El ID debe ser un número'),
    body('name')
        .notEmpty().withMessage('El nombre no puede ir vacio'),
    body('lastname')
        .notEmpty().withMessage('El apellido no puede ir vacio'),
    body('email')
        .isEmail().withMessage('E-mail no válido'),
    body('roles')
        .isArray().withMessage('Los roles deben ser un arreglo')
        .notEmpty().withMessage('Los roles no pueden ir vacios'),
    handleInputErrors,
    authenticate,
    AuthController.updateUserById
)

router.post('/confirm-account',
    body('token')
        .notEmpty().withMessage('El Token no puede ir vacio'),
    handleInputErrors,
    AuthController.confirmAccount
)

router.post('/login',
    body('email')
        .isEmail().withMessage('E-mail no válido'),
    body('password')
        .notEmpty().withMessage('El password no puede ir vacio'),
    handleInputErrors,
    AuthController.login
)

router.post('/request-code',
    body('email')
        .isEmail().withMessage('E-mail no válido'),
    handleInputErrors,
    AuthController.requestConfirmationCode
)

router.post('/forgot-password',
    body('email')
        .isEmail().withMessage('E-mail no válido'),
    handleInputErrors,
    AuthController.forgotPassword
)

router.post('/validate-token',
    body('token')
        .notEmpty().withMessage('El Token no puede ir vacio'),
    handleInputErrors,
    AuthController.validateToken
)

router.post('/update-password/:token',
    param('token')
        .isNumeric().withMessage('Token no válido'),
    body('password')
        .isLength({ min: 8 }).withMessage('El password es muy corto, minimo 8 caracteres'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Los Password no son iguales')
        }
        return true
    }),
    handleInputErrors,
    AuthController.updatePasswordWithToken
)

router.get('/user',
    authenticate,
    AuthController.user
)

//Obtener todos los usuarios
router.get('/users',
    authenticate,
    AuthController.getAllUsers
)

/** Profile */
// Actualizar perfil del usuario autenticado (protegido por autenticación)
router.put(
    '/profile',
    authenticate, // Solo usuarios autenticados pueden acceder
    checkPermission(Permissions.UPDATE_USER_PROFILE), // Necesita el permiso para actualizar el perfil
    body('name').notEmpty().withMessage('El nombre no puede ir vacio'),
    body('email').isEmail().withMessage('E-mail no válido'),
    handleInputErrors,
    AuthController.updateProfile
  );
  
  // Cambiar contraseña del usuario autenticado (protegido por autenticación)
  router.post(
    '/update-password',
    authenticate, // Solo usuarios autenticados pueden acceder
    checkPermission(Permissions.UPDATE_USER_PASSWORD), // Necesita el permiso para actualizar la contraseña
    body('current_password').notEmpty().withMessage('El password actual no puede ir vacio'),
    body('password').isLength({ min: 8 }).withMessage('El password es muy corto, mínimo 8 caracteres'),
    body('password_confirmation').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Los Password no son iguales');
      }
      return true;
    }),
    handleInputErrors,
    AuthController.updateCurrentUserPassword
  );
  
  // Verificar si el password actual es correcto (protegido por autenticación)
  router.post(
    '/check-password',
    authenticate, // Solo usuarios autenticados pueden acceder
    checkPermission(Permissions.CHECK_USER_PASSWORD), // Necesita el permiso para verificar el password
    body('password').notEmpty().withMessage('El password no puede ir vacio'),
    handleInputErrors,
    AuthController.checkPassword
  );

export default router