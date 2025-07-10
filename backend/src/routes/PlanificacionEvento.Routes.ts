import { Router } from 'express';
import { PlanificacionEventoControllers } from '../controllers/PlanificacionEventoController';
import { body } from 'express-validator';
import { handleInputErrors } from '../middleware/validation';
import { authenticate } from '../middleware/auth'; // <-- aquí usas tu middleware

const router = Router();

router.post(
  '/',
  authenticate,
  body('NombreEvento').notEmpty().withMessage('El nombre del evento es requerido'),
  body('FechaEvento').notEmpty().withMessage('La fecha es requerida'),
  body('LugarDeEvento').notEmpty().withMessage('La ubicación es requerida'),
  handleInputErrors,
  PlanificacionEventoControllers.crearPlanificacion
);

export default router;
