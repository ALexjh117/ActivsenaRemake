import { Router } from 'express';
import { FeedbackController } from '../controllers/FeedbackController';
import { handleInputErrors } from '../middleware/validation';
import {validateIdFeedback,validateComentarioFeedbackUnico,validateFeedbackBody} from '../middleware/Feedback';

const router = Router();

// Obtener todos los feedbacks
router.get('/', FeedbackController.getAllFeedbacks);

// Obtener un feedback por ID
router.get(
  '/:IdFeedback',
  validateIdFeedback,
  handleInputErrors,
  FeedbackController.getFeedbackById 
);

// Crear un nuevo feedback
router.post(
  '/',
  validateComentarioFeedbackUnico,
  validateFeedbackBody,
  handleInputErrors,
  FeedbackController.crearFeedback
);

// Actualizar un feedback por ID
router.put(
  '/:IdFeedback',
  validateIdFeedback,
  validateFeedbackBody,
  handleInputErrors,
  FeedbackController.actualizarFeedbackById
);

// Eliminar un feedback por ID
router.delete(
  '/:IdFeedback',
  validateIdFeedback,
  handleInputErrors,
  FeedbackController.eliminarFeedbackById
);

export default router;