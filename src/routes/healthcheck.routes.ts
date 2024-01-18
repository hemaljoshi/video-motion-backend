import { Router } from 'express';
import { healthcheck } from "../controllers/healthcheck.controller"

const router = Router();

/**
 * @swagger
 * /api/v1/healthcheck:
 *   get:
 *     tags:
 *       - Healthcheck
 *     description: Healthcheck
 *     responses:
 *        200:
 *         description: Healthcheck successful
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               message: "OK"
 *               success: true
 *        500:
 *         description: Internal Server Error
 */

router.route('/').get(healthcheck);

export default router