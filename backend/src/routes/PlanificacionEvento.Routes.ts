import { Router } from 'express';
import { body, param } from 'express-validator';
import { PlanificacionEventoControllers } from '../controllers/PlanificacionEventoController'; 
import { handleInputErrors } from '../middleware/validation';
import {validatePlanificarEventoBody,validateIdPlanificarEvento,validateIdPlanificarEventoYaExiste,} from '../middleware/PlanificacionEvento'; 

const router = Router();


router.get('/', PlanificacionEventoControllers.getPlanificarEventoAll);


router.get('/:IdPlanificarE',
  validateIdPlanificarEvento,
  handleInputErrors,
  PlanificacionEventoControllers.getIdPlanificarEvento
);


router.post(
  '/',
  validateIdPlanificarEventoYaExiste,
  validatePlanificarEventoBody,
  handleInputErrors,
  PlanificacionEventoControllers.crearPlanificarEvento
);


router.put(
  '/:IdPlanificarE',
  validateIdPlanificarEvento,
  validatePlanificarEventoBody,
  handleInputErrors,
  PlanificacionEventoControllers.actualizarIdPlanificarEvento
);


router.delete(
  '/:IdPlanificarE',
  validateIdPlanificarEvento,
  handleInputErrors,
  PlanificacionEventoControllers.eliminarIdPlanificarEvento
);

export default router;
