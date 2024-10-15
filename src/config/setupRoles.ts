import Role from "../models/Role";  // Importa el modelo de roles

// Permisos por defecto que se asignarán a cada rol
const defaultRoles = [
  {
    name: "Administrador",
    permissions: [
      'CREATE_USER_ACCOUNT_ADMIN',
        'VIEW_USER_PROFILE',
        'UPDATE_USER_PROFILE',
        'UPDATE_USER_PASSWORD',
        'CHECK_USER_PASSWORD',
        'CREATE_CATEGORY',
        'VIEW_CATEGORIES',
        'VIEW_CATEGORY',
        'UPDATE_CATEGORY',
        'DELETE_CATEGORY',
        'CREATE_INGREDIENT',
        'VIEW_INGREDIENTS',
        'VIEW_INGREDIENT',
        'UPDATE_INGREDIENT',
        'DELETE_INGREDIENT',
        'CREATE_PRODUCT',
        'VIEW_PRODUCTS',
        'VIEW_PRODUCT',
        'UPDATE_PRODUCT',
        'DELETE_PRODUCT',
        'VIEW_SESSIONS',
        'VIEW_SESSION',
        'UPDATE_SESSION',
        'DELETE_SESSION',
        'CREATE_TABLE',
        'VIEW_TABLES',
        'VIEW_TABLE',
        'UPDATE_TABLE',
        'DELETE_TABLE',
        "CREATE_ROLE",                             
        "VIEW_ROLES",                               
        "VIEW_ROLE",                                 
        "UPDATE_ROLE",                             
        "DELETE_ROLE"
    ],
  },
  {
    name: "Usuario",
    permissions: [
      "VIEW_USER_PROFILE",
      "UPDATE_USER_PROFILE",
      "UPDATE_USER_PASSWORD",
      "CHECK_USER_PASSWORD"
    ],
  },
];

export async function setupDefaultRoles() {
  try {
    for (const roleData of defaultRoles) {
      const existingRole = await Role.findOne({ name: roleData.name });
      if (!existingRole) {
        await Role.create(roleData);
        console.log(`Rol ${roleData.name} creado.`);
      }
    }
  } catch (error) {
    console.error("Error configurando roles por defecto", error);
  }
}
