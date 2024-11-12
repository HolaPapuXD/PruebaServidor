require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/registrar', (req, res) => {
  const emailUsuario = req.body.email;

  // Correo para el usuario
  const mailOptionsUser = {
    from: process.env.EMAIL_USER,
    to: emailUsuario,
    subject: 'Registro exitoso',
    text: 'Gracias por registrarte en nuestro formulario.'
  };

  // Correo para el dueño de la página
  const mailOptionsOwner = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: 'Nuevo registro en el formulario',
    text: `Un usuario se ha registrado con el correo: ${emailUsuario}`
  };

  // Enviar correos
  transporter.sendMail(mailOptionsUser, (error, info) => {
    if (error) {
      return res.status(500).send('Error al enviar el correo.');
    }
  });

  transporter.sendMail(mailOptionsOwner, (error, info) => {
    if (error) {
      return res.status(500).send('Error al enviar notificación al dueño.');
    }
  });

  res.send('Formulario enviado correctamente.');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});