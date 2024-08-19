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
}