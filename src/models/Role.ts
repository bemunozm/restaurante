import { Document, Schema, Types } from "mongoose";
import mongoose from "mongoose";

//Permisos disponibles
export enum Permissions {
  // Gestión de cuentas
  CREATE_USER_ACCOUNT_ADMIN = "CREATE_USER_ACCOUNT_ADMIN",  // Permite que un 'Administrador' cree cuentas para otros roles

  // Gestión de perfil de usuario autenticado
  VIEW_USER_PROFILE = "VIEW_USER_PROFILE",                 // Ver el perfil del usuario autenticado
  UPDATE_USER_PROFILE = "UPDATE_USER_PROFILE",             // Actualizar perfil del usuario autenticado
  UPDATE_USER_PASSWORD = "UPDATE_USER_PASSWORD",           // Cambiar la contraseña del usuario autenticado
  CHECK_USER_PASSWORD = "CHECK_USER_PASSWORD",              // Verificar si la contraseña ingresada es correcta

  //Gestion de categorias
  CREATE_CATEGORY = "CREATE_CATEGORY",                     // Crear una categoría
  VIEW_CATEGORIES = "VIEW_CATEGORIES",                     // Ver todas las categorías
  VIEW_CATEGORY = "VIEW_CATEGORY",                         // Ver una categoría específica
  UPDATE_CATEGORY = "UPDATE_CATEGORY",                     // Actualizar una categoría
  DELETE_CATEGORY = "DELETE_CATEGORY",                      // Eliminar una categoría

  //Gestion de ingredientes
  CREATE_INGREDIENT = "CREATE_INGREDIENT",                 // Crear un ingrediente
  VIEW_INGREDIENTS = "VIEW_INGREDIENTS",                   // Ver todos los ingredientes
  VIEW_INGREDIENT = "VIEW_INGREDIENT",                     // Ver un ingrediente específico
  UPDATE_INGREDIENT = "UPDATE_INGREDIENT",                 // Actualizar un ingrediente
  DELETE_INGREDIENT = "DELETE_INGREDIENT",                  // Eliminar un ingrediente

  //Gestion de productos
  CREATE_PRODUCT = "CREATE_PRODUCT",                       // Crear un producto
  VIEW_PRODUCTS = "VIEW_PRODUCTS",                         // Ver todos los productos
  VIEW_PRODUCT = "VIEW_PRODUCT",                           // Ver un producto específico
  UPDATE_PRODUCT = "UPDATE_PRODUCT",                       // Actualizar un producto
  DELETE_PRODUCT = "DELETE_PRODUCT",                        // Eliminar un producto

  //Gestion de sesiones
  VIEW_SESSIONS = "VIEW_SESSIONS",                         // Ver todas las sesiones
  VIEW_SESSION = "VIEW_SESSION",                           // Ver una sesión específica
  UPDATE_SESSION = "UPDATE_SESSION",                       // Actualizar (cerrar) una sesión
  DELETE_SESSION = "DELETE_SESSION",                       // Eliminar una sesión

  //Gestion de mesas
  CREATE_TABLE = "CREATE_TABLE",                           // Crear una mesa
  VIEW_TABLES = "VIEW_TABLES",                             // Ver todas las mesas
  VIEW_TABLE = "VIEW_TABLE",                               // Ver una mesa específica
  UPDATE_TABLE = "UPDATE_TABLE",                           // Actualizar una mesa
  DELETE_TABLE = "DELETE_TABLE",                            // Eliminar una mesa

  //Gestion de roles
  CREATE_ROLE = "CREATE_ROLE",                             // Crear un rol
  VIEW_ROLES = "VIEW_ROLES",                               // Ver todos los roles
  VIEW_ROLE = "VIEW_ROLE",                                 // Ver un rol específico
  UPDATE_ROLE = "UPDATE_ROLE",                             // Actualizar un rol
  DELETE_ROLE = "DELETE_ROLE",                              // Eliminar un rol
  
}

// Agrupar los permisos en categorías solo para el frontend
export const permissionGroups = {
  "Gestión de Usuarios": [
    Permissions.CREATE_USER_ACCOUNT_ADMIN,
    Permissions.VIEW_USER_PROFILE,
    Permissions.UPDATE_USER_PROFILE,
    Permissions.UPDATE_USER_PASSWORD,
    Permissions.CHECK_USER_PASSWORD,
  ],
  "Gestión de Categorías": [
    Permissions.CREATE_CATEGORY,
    Permissions.VIEW_CATEGORIES,
    Permissions.VIEW_CATEGORY,
    Permissions.UPDATE_CATEGORY,
    Permissions.DELETE_CATEGORY,
  ],
  "Gestión de Ingredientes": [
    Permissions.CREATE_INGREDIENT,
    Permissions.VIEW_INGREDIENTS,
    Permissions.VIEW_INGREDIENT,
    Permissions.UPDATE_INGREDIENT,
    Permissions.DELETE_INGREDIENT,
  ],
  "Gestión de Productos": [
    Permissions.CREATE_PRODUCT,
    Permissions.VIEW_PRODUCTS,
    Permissions.VIEW_PRODUCT,
    Permissions.UPDATE_PRODUCT,
    Permissions.DELETE_PRODUCT,
  ],
  "Gestión de Sesiones": [
    Permissions.VIEW_SESSIONS,
    Permissions.VIEW_SESSION,
    Permissions.UPDATE_SESSION,
    Permissions.DELETE_SESSION,
  ],
  "Gestión de Mesas": [
    Permissions.CREATE_TABLE,
    Permissions.VIEW_TABLES,
    Permissions.VIEW_TABLE,
    Permissions.UPDATE_TABLE,
    Permissions.DELETE_TABLE,
  ],
  "Gestión de Roles": [
    Permissions.CREATE_ROLE,
    Permissions.VIEW_ROLES,
    Permissions.VIEW_ROLE,
    Permissions.UPDATE_ROLE,
    Permissions.DELETE_ROLE,
  ],
};


export type RoleType = Document & {
  _id: string;
  name: string;
  permissions: string[];
};

const RoleSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    permissions: { type: [String], enum: Object.values(Permissions), required: true },
  },
  { timestamps: true }
);

const Role = mongoose.model<RoleType>("Role", RoleSchema);

export default Role;
