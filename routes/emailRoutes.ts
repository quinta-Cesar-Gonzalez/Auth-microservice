import { Router } from 'express';
import { sendCompanyEmail } from '../controllers/emailController';
import logger from "../utils/logger";

const router = Router();

/**
 * @swagger
 * /api/send-email:
 *   post:
 *     summary: Send an invitation email to one or multiple addresses
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyId:
 *                 type: string
 *                 description: ID of the company
 *               language:
 *                 type: string
 *                 enum: [es, en]
 *                 description: Language for the email template
 *               emails:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: One or multiple email addresses
 *               message:
 *                 type: string
 *                 description: Optional message to include in the email
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       404:
 *         description: Company not found
 *       500:
 *         description: Server error
 */
router.post('/send-email', (req, res, next) => {
    logger.info('[Controller - Send Email]: Sending an email')
    sendCompanyEmail(req, res).catch((error) => {
      logger.error(`[Controller - Send Email]: Error sending email: ${error}`);
      next(error);
    });
});

export default router;
