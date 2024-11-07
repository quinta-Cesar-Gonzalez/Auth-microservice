import { Router } from "express";
import { getAllCompanies, addCompany } from "../controllers/companyController";
import logger from "../utils/logger";

const router = Router();

/**
 * @swagger
 * /api/companies:
 *   get:
 *     summary: Retrieve all companies
 *     tags: [Company Management]
 *     responses:
 *       200:
 *         description: Successfully retrieved all companies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   cliente:
 *                     type: string
 *                     description: Client name
 *                   nombre:
 *                     type: string
 *                     description: Company name
 *                   rfc:
 *                     type: string
 *                     description: Company RFC
 *                   cp:
 *                     type: string
 *                     description: Postal code
 *                   domicilio:
 *                     type: string
 *                     description: Address
 *                   telefonos:
 *                     type: string
 *                     description: Phone numbers
 *                   representante:
 *                     type: string
 *                     description: Representative name
 *                   email:
 *                     type: string
 *                     description: Email address
 *                   IP:
 *                     type: string
 *                     description: IP address
 *                   usuariomaster:
 *                     type: string
 *                     description: Master user
 *                   passmaster:
 *                     type: string
 *                     description: Master password
 *                   putilidad:
 *                     type: number
 *                     description: Profit percentage
 *                   Fecha_alta:
 *                     type: string
 *                     format: date
 *                     description: Creation date
 *       500:
 *         description: Server error
 */
router.get('/companies', (req, res, next) => {
  logger.info('[Controller - GetAllCompanies]: Received request to fetch all companies');
  getAllCompanies(req, res).catch((error) => {
    logger.error(`[Controller - GetAllCompanies]: Error fetching companies: ${error}`);
    next(error);
  });
});


/**
 * @swagger
 * /api/companies:
 *   post:
 *     summary: Insert a new company
 *     tags: [Company Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cliente:
 *                 type: string
 *                 description: Client name
 *               nombre:
 *                 type: string
 *                 description: Company name
 *               rfc:
 *                 type: string
 *                 description: Company RFC
 *               cp:
 *                 type: string
 *                 description: Postal code
 *               domicilio:
 *                 type: string
 *                 description: Address
 *               telefonos:
 *                 type: string
 *                 description: Phone numbers
 *               representante:
 *                 type: string
 *                 description: Representative name
 *               email:
 *                 type: string
 *                 description: Email address
 *               IP:
 *                 type: string
 *                 description: IP address
 *               usuariomaster:
 *                 type: string
 *                 description: Master user
 *               passmaster:
 *                 type: string
 *                 description: Master password
 *               putilidad:
 *                 type: number
 *                 description: Profit percentage
 *               Fecha_alta:
 *                 type: string
 *                 format: date
 *                 description: Creation date
 *     responses:
 *       201:
 *         description: Company added successfully
 *       500:
 *         description: Server error
 */
router.post('/companies', (req, res, next) => {
    logger.info('Received request to add a new company');
    addCompany(req, res).catch((error) => {
      logger.error(`Error adding company: ${error}`);
      next(error);
    });
  });

export default router;
