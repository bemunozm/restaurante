import { transporter } from "../config/nodemailer";

type EmailDataType = {
  email: string;
  name: string;
  token: string;
};

export class AuthEmail {
  static sendEmailConfirmation = async (data: EmailDataType) => {
    const info = await transporter.sendMail({
      from: "Restaurante <admin@restaurante.com>",
      to: data.email,
      subject: "Restaurante - Confirma tu cuenta",
      text: "Restaurante - Confirma tu cuenta",
      html: `<p>Hola: ${data.name}, has creado tu cuenta en Restaurante, ya casi esta todo listo, solo debes confirmar tu cuenta</p>
            <p>Visita el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>
            <p>E ingresa el siguiente código: <b>${data.token}</b></p>
            <p>Este token expira en 10 minutos</p>
`,
    });
    console.log("Mensaje enviado correctamente", info.messageId);
  };
}
