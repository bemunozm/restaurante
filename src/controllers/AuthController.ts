import type { Request, Response } from 'express';
import User from '../models/User';
import Token from '../models/Token';
import { checkPassword, hashPassword } from '../utils/auth';
import { generateToken } from '../utils/token';
import { AuthEmail } from '../emails/AuthEmail';
import { generateJWT } from '../utils/jwt';
import Role, { RoleType } from '../models/Role';
import Order from '../models/Order';
import Session from '../models/Session';

export class AuthController {

    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email, guestId, sessionId, tableId } = req.body;
            
            // Verificar si el usuario ya existe
            const userExists = await User.findOne({ email });
            if (userExists) {
                const error = new Error('El Usuario ya está registrado');
                return res.status(409).json({ error: error.message });
            }
    
            // Asignar el rol por defecto para los clientes
            const defaultRole = await Role.findOne({ name: 'Usuario' });
            if (!defaultRole) {
                const error = new Error('Rol por defecto no encontrado');
                return res.status(500).json({ error: error.message });
            }
    
            // Crear el usuario con el rol predeterminado
            const user = new User(req.body);
            user.roles = [defaultRole.id];
    
            // Hash de la contraseña
            user.password = await hashPassword(password);
    
            // Generar token de confirmación de cuenta
            const token = new Token();
            token.token = generateToken();
            token.user = user.id;
    
            // Enviar el email de confirmación
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token,
            });
    
            // Guardar usuario y token
            await Promise.allSettled([user.save(), token.save()]);
    
            // Manejo de sesiones para usuarios invitados que se registran
            if (guestId) {
                // Encontrar la sesión y el invitado correspondiente
                const session = await Session.findById(sessionId);
                if (!session) {
                    return res.status(404).json({ error: 'Sesión no encontrada' });
                }
    
                const guestToUpdate = session.guests.find(guest => guest._id.toString() === guestId);
                if (!guestToUpdate) {
                    return res.status(404).json({ error: 'Invitado no encontrado en la sesión' });
                }
    
                // Actualizar el invitado con el userId
                guestToUpdate.user = user.id;
                await session.save();
    
                // Actualizar pedidos del invitado con el userId
                await Order.updateMany(
                    { guestId, sessionId },
                    { $set: { userId: user._id }, $unset: { guestId: 1 } }
                );
            }
    
            // Generar el JWT para el usuario y devolverlo junto con la sesión y mesa
            const jwtToken = generateJWT({
                id: user._id.toString(),
                sessionId: sessionId?.toString() || '',
                tableId: tableId?.toString() || '',
                role: 'Usuario',
            });
    
            res.send({ token: jwtToken, sessionId }); // Devolver el JWT junto con la sesión
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };

    static getAllUsers = async (req: Request, res: Response) => {
        try {
            const users = await User.find().populate('roles');
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }

    static getUserById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const user = await User.findById(id).populate('roles');
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }

    static updateUserById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { name, lastname, email, roles } = req.body;

            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            const assignedRoles : RoleType[] = await Role.find({ _id: { $in: roles } });
            if (assignedRoles.length !== roles.length) {
                const error = new Error('Uno o más roles no fueron encontrados');
                return res.status(404).json({ error: error.message });
              }

            user.name = name;
            user.lastname = lastname;
            user.email = email;
            user.roles = assignedRoles;

            await user.save();
            res.send('Usuario actualizado correctamente');
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }
            

    //CREAR UNA CUENTA CON DIFERENTES ROLES (COCINA, MESERO, 'Administrador')
    static createAccountByAdmin = async (req: Request, res: Response) => {
        try {
          const { name, lastname, email, roles } = req.body;
    
          // Prevenir duplicados
          const userExists = await User.findOne({ email });
          if (userExists) {
            const error = new Error('El Usuario ya está registrado');
            return res.status(409).json({ error: error.message });
          }
    
          // Buscar los roles especificados por los IDs proporcionados en el cuerpo de la solicitud
          const assignedRoles = await Role.find({ _id: { $in: roles } });
    
          if (assignedRoles.length !== roles.length) {
            const error = new Error('Uno o más roles no fueron encontrados');
            return res.status(404).json({ error: error.message });
          }
    
          // Crear una contraseña aleatoria temporal
          const password = generateToken();
          
          // Hash de la contraseña
          const encryptedPassword = await hashPassword(password);
    
          // Crear el usuario con los roles asignados
          const user = new User({
            name,
            lastname,
            email,
            password: encryptedPassword,
            roles: assignedRoles.map(role => role._id),  // Asignar múltiples roles
            confirmed: false, // La cuenta está confirmada por defecto
          });
    
          // Generar un token de recuperación de contraseña
          const token = new Token();
          token.token = generateToken();
          token.user = user.id;
          await token.save();
    
          // Enviar el email de bienvenida con el token para que el usuario establezca su contraseña
          AuthEmail.sendWelcomeEmail({
            email: user.email,
            name: user.name,
            token: token.token,
          });
    
          // Guardar usuario y token
          await Promise.allSettled([user.save(), token.save()]);
    
          res.send('Cuenta creada con los roles solicitados, se envió un correo de recuperación');
        } catch (error) {
          res.status(500).json({ error: 'Hubo un error al crear la cuenta' });
        }
      };

      static deleteUserById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            console.log(id);

            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            await user.deleteOne();
            res.send('Usuario eliminado correctamente');
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body

            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error('Token no válido')
                return res.status(404).json({ error: error.message })
            }

            const user = await User.findById(tokenExists.user)
            user.confirmed = true

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])
            res.send('Cuenta confirmada correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password, guestId, sessionId, tableId } = req.body;
    
            // Verificar si el usuario existe
            const user = await User.findOne({ email }).populate('roles'); // Asegurarnos de obtener los roles del usuario
            if (!user) {
                const error = new Error('Usuario no encontrado');
                return res.status(404).json({ error: error.message });
            }
    
            // Verificar si la cuenta está confirmada
            if (!user.confirmed) {
                const token = new Token();
                token.user = user.id;
                token.token = generateToken();
                await token.save();
    
                // Enviar el email de confirmación
                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token,
                });
    
                const error = new Error('La cuenta no ha sido confirmada, hemos enviado un e-mail de confirmación');
                return res.status(401).json({ error: error.message });
            }
    
            // Verificar password
            const isPasswordCorrect = await checkPassword(password, user.password);
            if (!isPasswordCorrect) {
                const error = new Error('Password Incorrecto');
                return res.status(401).json({ error: error.message });
            }
    
            // Verificar roles del usuario para determinar el tipo de autenticación
            const roles = user.roles.map(role => role.name);
            
            if (roles.includes('Usuario')) {
                    // Caso para "Usuario" (cliente)
                    // Transferir pedidos de invitado a usuario registrado, si aplica
                    if (guestId) {
                    // 1. Encontrar la sesión y el invitado correspondiente
                    const session = await Session.findById(sessionId);
                    if (!session) {
                        return res.status(404).json({ error: 'Sesión no encontrada' });
                    }

                    // 2. Encontrar el invitado en la sesión
                    const guestToUpdate = session.guests.find(guest => guest._id.toString() === guestId);
                    if (!guestToUpdate) {
                        return res.status(404).json({ error: 'Invitado no encontrado en la sesión' });
                    }

                    // 3. Actualizar el invitado con el userId
                    guestToUpdate.user = user.id;

                    // Guardar la sesión actualizada con el invitado modificado
                    await session.save();


                    await Order.updateMany(
                        { guestId, sessionId },
                        { $set: { userId: user._id }, $unset: { guestId: 1 } }
                    );
                }
    
                // Generar el JWT para el usuario y enviar la sesión y mesa
                const token = generateJWT({
                    id: user._id.toString(),
                    sessionId: sessionId?.toString() || '',
                    tableId: tableId?.toString() || '',
                    role: 'Usuario'
                });
    
                return res.send({token, sessionId});  // Devuelve el JWT con la sesión y mesa
    
            } else {
                // Caso para "staff" (sin mesa ni sesión)
                const token = generateJWT({
                    id: user._id.toString(),
                    role: 'Usuario'  // Asignar el rol "staff" o los roles específicos si lo prefieres
                });
    
                return res.send({token});  // Devuelve el JWT sin datos de sesión ni mesa
    
            }
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }

    static requestConfirmationCode = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            // Usuario existe
            const user = await User.findOne({ email })
            if (!user) {
                const error = new Error('El Usuario no esta registrado')
                return res.status(404).json({ error: error.message })
            }

            if(user.confirmed) {
                const error = new Error('El Usuario ya esta confirmado')
                return res.status(403).json({ error: error.message })
            }

            // Generar el token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            // enviar el email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])

            res.send('Se envió un nuevo token a tu e-mail')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            // Usuario existe
            const user = await User.findOne({ email })
            if (!user) {
                const error = new Error('El Usuario no esta registrado')
                return res.status(404).json({ error: error.message })
            }

            // Generar el token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id
            await token.save()

            // enviar el email
            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            })
            res.send('Revisa tu email para instrucciones')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static validateToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.body

            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error('Token no válido')
                return res.status(404).json({ error: error.message })
            }
            res.send('Token válido, Define tu nuevo password')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.params
            const { password } = req.body

            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error('Token no válido')
                return res.status(404).json({ error: error.message })
            }

            const user = await User.findById(tokenExists.user)
            user.password = await hashPassword(password)

            if(!user.confirmed) {
                user.confirmed = true
            }

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])

            res.send('El password se modificó correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static user = async (req: Request, res: Response) => {
        return res.json({
            user: req.user || {},
            guest: req.guest || {},
            sessionId: req.sessionId || '',
            tableId: req.tableId || '',
            role: req.role || ''
        })
    };

    static updateProfile = async (req: Request, res: Response) => {
        const { name, email } = req.body

        const userExists = await User.findOne({email})
        if(userExists && userExists.id.toString() !== req.user.id.toString() ) {
            const error = new Error('Ese email ya esta registrado')
            return res.status(409).json({error: error.message})
        }

        req.user.name = name
        req.user.email = email

        try {
            await req.user.save()
            res.send('Perfil actualizado correctamente')
        } catch (error) {
            res.status(500).send('Hubo un error')
        }
    }

    static updateCurrentUserPassword = async (req: Request, res: Response) => {
        const { current_password, password } = req.body

        const user = await User.findById(req.user.id)

        const isPasswordCorrect = await checkPassword(current_password, user.password)
        if(!isPasswordCorrect) {
            const error = new Error('El Password actual es incorrecto')
            return res.status(401).json({error: error.message})
        }

        try {
            user.password = await hashPassword(password)
            await user.save()
            res.send('El Password se modificó correctamente')
        } catch (error) {
            res.status(500).send('Hubo un error')
        }
    } 

    static checkPassword = async (req: Request, res: Response) => {
        const { password } = req.body

        const user = await User.findById(req.user.id)

        const isPasswordCorrect = await checkPassword(password, user.password)
        if(!isPasswordCorrect) {
            const error = new Error('El Password es incorrecto')
            return res.status(401).json({error: error.message})
        }

        res.send('Password Correcto')
    }
}