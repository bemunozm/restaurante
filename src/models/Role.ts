import { Document, Schema } from "mongoose";
import mongoose from "mongoose";

//Permisos disponibles
export enum Permissions {
  // Gestión de cuentas
  CREATE_USER_ACCOUNT_ADMIN = "CREATE_USER_ACCOUNT_ADMIN",  // Permite que un administrador cree cuentas para otros roles

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
}


export type RoleType = Document & {
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
