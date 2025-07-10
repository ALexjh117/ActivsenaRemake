import { Router } from 'express';
import { RelUsuarioEventoControllers } from '../controllers/RelUsuarioEventoController';
import {validateIdRelUsuarioEvento,validateRelUsuarioEventoBody,validateRelUsuarioEventoYaExiste,} from '../middleware/RelUsuarioEvento';
import { handleInputErrors } from '../middleware/validation';

const router = Router();


router.get('/', RelUsuarioEventoControllers.getRelUsuarioEventoAll);


router.get(
  '/:IdUsuario',
  validateIdRelUsuarioEvento,
  handleInputErrors,
  RelUsuarioEventoControllers.getIdRelUsuarioEvento
);


router.post(
  '/',
  validateRelUsuarioEventoYaExiste,
  validateRelUsuarioEventoBody,
  handleInputErrors,
  RelUsuarioEventoControllers.crearRelUsuarioEvento
);


router.put(
  '/:id',
  validateIdRelUsuarioEvento,
  validateRelUsuarioEventoBody,
  handleInputErrors,
  RelUsuarioEventoControllers.actualizarIdRelUsuarioEvento
);


router.delete(
  '/:id',
  validateIdRelUsuarioEvento,
  handleInputErrors,
  RelUsuarioEventoControllers.eliminarIdRelUsuarioEvento
);

export default router;
