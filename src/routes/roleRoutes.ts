import { Router } from 'express';
import { body, param } from 'express-validator';
import { handleInputErrors } from '../middleware/validation';
import { authenticate } from '../middleware/auth';
import checkPermission from '../middleware/permission'
import { Permissions } from '../models/Role'; // Importamos el enum de permisos
import { RoleController } from '../controllers/RoleController';

const router = Router();

// CRUD de roles

//Obtener permisos
router.get('/permissions',
    authenticate, // Solo usuarios autenticados pueden acceder
    checkPermission(Permissions.CREATE_USER_ACCOUNT_ADMIN), // Solo 'Administrador'es pueden obtener la lista de permisos
    RoleController.getPermissions
);

// Crear un rol 
router.post('/create-role',
  authenticate, // Solo usuarios autenticados pueden acceder
  checkPermission(Permissions.CREATE_USER_ACCOUNT_ADMIN), // Solo 'Administrador'es pueden crear roles
  body('name').notEmpty().withMessage('El nombre del rol es obligatorio'),
  body('permissions')
    .isArray().withMessage('Los permisos deben ser un arreglo')
    .custom((permissions: Permissions[]) => {
      const validPermissions = Object.values(Permissions);
      const invalidPermissions = permissions.filter(permission => !validPermissions.includes(permission));
      if (invalidPermissions.length > 0) {
        throw new Error(`Permisos inválidos: ${invalidPermissions.join(', ')}`);
      }
      return true;
    }),
  handleInputErrors,
  RoleController.createRole
);

// Obtener todos los roles 
router.get('/get-roles',
  authenticate, // Solo usuarios autenticados pueden acceder
  checkPermission(Permissions.CREATE_USER_ACCOUNT_ADMIN), // Solo 'Administrador'es pueden ver los roles
  handleInputErrors,
  RoleController.getRoles
);

// Obtener un rol específico 
router.get('/get-role/:id',
  authenticate, // Solo usuarios autenticados pueden acceder
  checkPermission(Permissions.CREATE_USER_ACCOUNT_ADMIN), // Solo 'Administrador'es pueden ver un rol específico
  param('id').isMongoId().withMessage('El ID del rol debe ser un ID de Mongo válido'),
  handleInputErrors,
  RoleController.getRoleById
);

// Actualizar un rol 
router.post('/update-role/:id',
  authenticate, // Solo usuarios autenticados pueden acceder
  checkPermission(Permissions.CREATE_USER_ACCOUNT_ADMIN), // Solo 'Administrador'es pueden actualizar roles
  param('id').isMongoId().withMessage('El ID del rol debe ser un ID de Mongo válido'),
  body('name').optional().notEmpty().withMessage('El nombre del rol es obligatorio si se envía'),
  body('permissions')
    .optional()
    .isArray().withMessage('Los permisos deben ser un arreglo')
    .custom((permissions: Permissions[]) => {
      const validPermissions = Object.values(Permissions);
      const invalidPermissions = permissions.filter(permission => !validPermissions.includes(permission));
      if (invalidPermissions.length > 0) {
        throw new Error(`Permisos inválidos: ${invalidPermissions.join(', ')}`);
      }
      return true;
    }),
  handleInputErrors,
  RoleController.updateRole
);

// Eliminar un rol 
router.delete(
  '/delete-role/:id',
  authenticate, // Solo usuarios autenticados pueden acceder
  checkPermission(Permissions.CREATE_USER_ACCOUNT_ADMIN), // Solo 'Administrador'es pueden eliminar roles
  param('id').isMongoId().withMessage('El ID del rol debe ser un ID de Mongo válido'),
  handleInputErrors,
  RoleController.deleteRole
);

export default router;
