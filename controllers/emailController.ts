import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import Quicliente from '../models/Quicliente';
import User from '../models/User';
import logger from '../utils/logger';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const templates = {
  InvitationES: (companyName: string, userId: string, message: string) => `
    <h1>Invitación para ${companyName}</h1>
    <p>ID del Usuario: ${userId}</p>
    <p>${message || 'Estimado cliente, le invitamos a formar parte de nuestro servicio exclusivo.'}</p>
  `,
  InvitationEN: (companyName: string, userId: string, message: string) => `
    <h1>Invitation for ${companyName}</h1>
    <p>User ID: ${userId}</p>
    <p>${message || 'Dear client, we invite you to join our exclusive service.'}</p>
  `,
};

export const sendCompanyEmail = async (req: Request, res: Response) => {
  try {
    const { companyId, language, emails, message } = req.body;

    // Buscar la empresa (QuiCliente) por ID
    const company = await Quicliente.findById(companyId);
    if (!company) {
      logger.warn(`Company with ID ${companyId} not found`);
      return res.status(404).json({ message: 'Company not found' });
    }

    const { rfc:RFC, cp: CP, domicilio: calle, telefonos: telefono } = company;
    const emailList = Array.isArray(emails) ? emails : [emails];

    // Listas para clasificar los correos
    const sentEmails = [];
    const emailsWithPassword = [];
    const emailsWithGoogleId = [];

    for (const email of emailList) {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        // Verificar si el usuario tiene password o client_googleId
        if (existingUser.password) {
          emailsWithPassword.push(email);
          logger.info(`Skipping email for ${email} due to existing password`);
          continue;
        }
        if (existingUser.client_googleId) {
          emailsWithGoogleId.push(email);
          logger.info(`Skipping email for ${email} due to existing Google ID`);
          continue;
        }

        // Usuario existe sin password ni Google ID, enviar correo
        const userId = existingUser.id.toString();
        const template = language === 'es' ? templates.InvitationES : templates.InvitationEN;
        const emailBody = template(company.nombre, userId, message);

        const mailOptions = {
          from: process.env.EMAIL_FROM,
          to: email,
          subject: language === 'es' ? `Invitación para ${company.nombre}` : `Invitation for ${company.nombre}`,
          html: emailBody,
        };

        await transporter.sendMail(mailOptions);
        logger.info(`Email sent successfully to existing user ${email}`);
        sentEmails.push(email);
      } else {
        // Crear nuevo usuario
        const newUser = new User({
          email,
          RFC,
          CP,
          calle,
          telefono,
          nombre: company.nombre,
        });

        await newUser.save();
        const userId = newUser.id.toString();
        const template = language === 'es' ? templates.InvitationES : templates.InvitationEN;
        const emailBody = template(company.nombre, userId, message);

        const mailOptions = {
          from: process.env.EMAIL_FROM,
          to: email,
          subject: language === 'es' ? `Invitación para ${company.nombre}` : `Invitation for ${company.nombre}`,
          html: emailBody,
        };

        await transporter.sendMail(mailOptions);
        logger.info(`Email sent successfully to new user ${email}`);
        sentEmails.push(email);
      }
    }

    res.status(200).json({
      message: 'Email processing completed',
      sentEmails,
      emailsWithPassword,
      emailsWithGoogleId,
    });
  } catch (error) {
    logger.error(`Error sending email: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
};
