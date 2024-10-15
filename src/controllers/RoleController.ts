import { Request, Response } from 'express';
import Role, { permissionGroups } from '../models/Role';

export class RoleController {
    // Obtener la lista de permisos disponibles
    static getPermissions(req: Request, res: Response) {
        try {
        res.status(200).json(permissionGroups);
        } catch (error) {
        res.status(500).json({ error: 'Error al obtener la lista de permisos' });
        }
    }

    // Crear un nuevo rol
    static async createRole(req: Request, res: Response) {
        try {
        const { name, permissions } = req.body;
        const role = new Role({ name, permissions });
        await role.save();
        res.status(201).json(role);
        } catch (error) {
        res.status(500).json({ error: 'Error al crear el rol' });
        }
    }

    // Obtener todos los roles
    static async getRoles(req: Request, res: Response) {
        try {
        const roles = await Role.find();
        res.status(200).json(roles);
        } catch (error) {
        res.status(500).json({ error: 'Error al obtener los roles' });
        }
    }

    // Obtener un rol específico por ID
    static async getRoleById(req: Request, res: Response) {
        try {
        const { id } = req.params;
        const role = await Role.findById(id);
        if (!role) {
            return res.status(404).json({ error: 'Rol no encontrado' });
        }
        res.status(200).json(role);
        } catch (error) {
        res.status(500).json({ error: 'Error al obtener el rol' });
        }
    }

    // Actualizar un rol existente
    static async updateRole(req, res) {
        try {
          const { id } = req.params;
          const { name, permissions } = req.body;
          const role = await Role.findById(id);
    
          if (!role) {
            return res.status(404).json({ message: 'Rol no encontrado' });
          }
    
          // Evitar que se modifiquen roles por defecto
          if (role.name === 'Administrador' || role.name === 'Usuario') {
            return res.status(403).json({ message: 'No se puede modificar este rol por defecto' });
          }
    
          role.name = name;
          role.permissions = permissions;
          await role.save();
          res.status(200).json({ message: 'Rol actualizado correctamente' });
        } catch (error) {
          res.status(500).json({ message: 'Error al actualizar el rol', error });
        }
    }

    // Eliminar un rol
    static async deleteRole(req, res) {
        try {
          const { id } = req.params;
          const role = await Role.findById(id);
    
          if (!role) {
            return res.status(404).json({ message: 'Rol no encontrado' });
          }
    
          // Evitar que se eliminen roles por defecto
          if (role.name === 'Administrador' || role.name === 'Usuario') {
            return res.status(403).json({ message: 'No se puede eliminar este rol por defecto' });
          }
    
          await role.deleteOne();
          res.status(200).json({ message: 'Rol eliminado correctamente' });
        } catch (error) {
          res.status(500).json({ message: 'Error al eliminar el rol', error });
        }
      }
}
