import { transporter } from "../config/nodemailer"

type EmailType = {
    email: string
    name: string
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async ( user : EmailType ) => {
        const info = await transporter.sendMail({
            from: 'Restaurante <admin@restaurante.com>',
            to: user.email,
            subject: 'Restaurante - Confirma tu cuenta',
            text: 'Restaurante - Confirma tu cuenta',
            html: `<p>Hola: ${user.name}, has creado tu cuenta en Restaurante, ya casi esta todo listo, solo debes confirmar tu cuenta</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>
                <p>E ingresa el código: <b>${user.token}</b></p>
                <p>Este token expira en 10 minutos</p>
            `
        })

        console.log('Mensaje enviado', info.messageId)
    }

    static sendPasswordResetToken = async ( user : EmailType ) => {
        const info = await transporter.sendMail({
            from: 'Restaurante <admin@restaurante.com>',
            to: user.email,
            subject: 'Restaurante - Reestablece tu password',
            text: 'Restaurante - Reestablece tu password',
            html: `<p>Hola: ${user.name}, has solicitado reestablecer tu password.</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer Password</a>
                <p>E ingresa el código: <b>${user.token}</b></p>
                <p>Este token expira en 10 minutos</p>
            `
        })

        console.log('Mensaje enviado', info.messageId)
    }

    static sendWelcomeEmail = async (user: EmailType) => {
        const info = await transporter.sendMail({
            from: 'Restaurante <admin@restaurante.com>',
            to: user.email,
            subject: '¡Bienvenido al equipo de Restaurante!',
            text: 'Bienvenido al equipo de Restaurante',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #007BFF;">¡Hola ${user.name}!</h2>
                    <p>Estamos muy emocionados de darte la bienvenida al equipo de <strong>Restaurante</strong>. Tu cuenta ha sido creada por un administrador y ahora eres parte de nuestra familia.</p>
                    <p>Para comenzar a usar tu cuenta y definir tu contraseña, por favor haz clic en el siguiente enlace:</p>
                    
                    <a href="${process.env.FRONTEND_URL}/auth/new-password?token=${user.token}" 
                       style="display: inline-block; padding: 10px 20px; margin: 10px 0; font-size: 16px; color: #fff; background-color: #28a745; border-radius: 5px; text-decoration: none;">
                       Configurar mi contraseña
                    </a>
                    
                    <p>O copia y pega la siguiente URL en tu navegador:</p>
                    <p>${process.env.FRONTEND_URL}/auth/new-password?token=${user.token}</p>
                    
                    <p>Este enlace es válido por 10 minutos, así que asegúrate de actualizar tu contraseña lo antes posible.</p>
                    <h3 style="color: #007BFF;">¿Qué puedes esperar?</h3>
                    <p>Como parte del equipo de <strong>Restaurante</strong>, tendrás acceso a nuestras herramientas internas para gestionar las operaciones diarias. Asegúrate de mantener tu información de acceso segura.</p>
                    <p>Si tienes alguna pregunta, no dudes en ponerte en contacto con tu supervisor o el equipo de soporte técnico.</p>
                    
                    <p>¡Esperamos que disfrutes trabajando con nosotros!</p>
                    <p>Saludos,</p>
                    <p><strong>Equipo de Restaurante</strong></p>
                </div>
            `,
        });
    
        console.log('Mensaje enviado', info.messageId);
    };
    
}