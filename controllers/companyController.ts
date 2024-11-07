import { Request, Response } from 'express';
import Quicliente from '../models/Quicliente';
import logger from '../utils/logger';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const getAllCompanies = async (req: Request, res: Response) => {
  try {
    logger.info('[Controller - getAllCompanies]: Fetching all companies');
    const companies = await Quicliente.find();
    res.status(200).json(companies);
  } catch (error) {
    logger.error(`[Controller - getAllCompanies]Error fetching companies: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addCompany = async (req: Request, res: Response) => {
  try {
    logger.info('Attempting to add a new company');

    const { passmaster, ...companyData } = req.body;
    let hashedPassword = '';
    if (passmaster) {
      hashedPassword = await bcrypt.hash(passmaster, SALT_ROUNDS);
    }
    const newCompany = new Quicliente({
      ...companyData,
      passmaster: hashedPassword
    });

    // Guardar la nueva empresa en la base de datos
    await newCompany.save();

    logger.info('Company added successfully');
    res.status(201).json({ message: 'Company added successfully', company: newCompany });
  } catch (error) {
    logger.error(`Error adding company: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
};
