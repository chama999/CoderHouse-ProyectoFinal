import { createTransport } from "nodemailer";
import config from "../config/config.js";
import { formatoPrecio, logger } from "../server/utils.js";

const transporter = createTransport(config.nodemailer.config);
logger(`Iniciando nodemailer: ${transporter}`, "info");
const sendEmail = async (to, subject, message, attachment) => {
        try {
            const from = config.nodemailer.config.auth.user;
            const mailOptions = {
            from,
            to,
            subject,
            html: message,
            attachments: attachment
                ? [
                    {
                    // filename and content type is derived from path
                    path: attachment
                    }
                ]
                : []
            };
            const info = await transporter.sendMail(mailOptions);
            logger(`Envío de email: ${JSON.stringify(info)}`, "debug");
        } catch (error) {
            logger(`Ocurrió un error al enviar email: ${error}`, "error");
        }
};

    // renderiza html para los mails de registros de usuarios
    const renderRegisterTable = userData => {
    const { email, name, age, address, phone } = userData;
    return `
        <h1>Nuevo usuario registrado</h1>
        </br>
        <table>
        <tbody>
            <tr>
            <td>Usuario:</td>
            <td>${email}</td>
            </tr>
            <tr>
            <td>Nombre:</td>
            <td>${name}</td>
            </tr>
            <tr>
            <td>Edad:</td>
            <td>${age}</td>
            </tr>
            <tr>
            <td>Dirección:</td>
            <td>${address}</td>
            </tr>
            <tr>
            <td>Teléfono:</td>
            <td>${phone}</td>
            </tr>
        </tbody>
    </table>`;
    };

// renderiza html para los mails de órdenes de pedidos de usuarios
// Hace un renderizado condicional según se trate el destino un usuario o Admin
const renderOrderTable = (orderData) => {
    logger("Iniciando envio de mmail de orden", "info");
const {
    orderNumber,
    carts,
    createdDate,
    status,
    updatedDate
    } = orderData;
    const {
        total,
        user,
        product
    } = carts;
    const {
        email,
        name,
        address,
        phone
    } = user;
  const title = "Nueva órden de pedido - creada"
  let html = `
    <div>
      <h1>${title}</h1>
      <p><b>N°: ${orderNumber}</b></p>
      <p><b>Fecha: </b>${createdDate}</p>
      <p><b>Usuario: </b>${email}</p>}
      <p><b>Nombre: </b>${name}</p>}
      <p><b>Domicilio: </b>${address}</p>
      <p><b>Teléfono: </b>${phone}</p>
      <p><i><b>ESTADO: </b>${status}</i></p>
      <table style="border-collapse:collapse;">;
        <thead>
            <tr style="background-color:#d3d3d3;">
                <th>#id</th>
                <th>Producto</th>
                <th>Cant</th>
                <th>Precio</th>
            </tr>
        </thead>`;
    html += `
            <tbody>`;
            for (const item of product) {
            html += `
                    <tr>
                        <td style="border-bottom:1px solid black;">
                        <p>${item.name}</p>
                        </td>
                        <td style="border-bottom:1px solid black;">
                        <p>${item.description}</p>
                        </td>
                        <td style="padding:0 16px;border-bottom:1px solid black;">${
                        item.quantity
                        }x</td>
                        <td style="border-bottom:1px solid black;text-align:right;"><b>$${formatoPrecio(
                        item.price
                        )}</b></td>
                    </tr>`;
            }
    html += `
        <tr style="background-color:#add8e6;">
            <td>
                <h3>TOTAL</h3>
            </td>
            <td style="text-align:right;"><h3>$${formatoPrecio(total)}</h3></td>
        </tr>
        </tbody>
        </table>
            <br><h2 style="color:#b30404;">¡Gracias por confiar en nosotros!</h2>
        </div>`;
    return html;
};

export { sendEmail, renderRegisterTable, renderOrderTable };