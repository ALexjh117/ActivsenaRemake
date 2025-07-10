import { Router } from 'express';
import { EventoControllers } from '../controllers/EventoController';
import {validateEventoBody,validateIdEvento,validateNombreEventoUnico} from '../middleware/Evento';
import { handleInputErrors } from '../middleware/validation';

const router = Router();

// Obtener todos los eventos
router.get('/', EventoControllers.getEventoAll);

// Obtener un evento por ID
router.get('/:IdEvento',
  validateIdEvento,
  handleInputErrors,
  EventoControllers.getIdEvento
);

// Crear un nuevo evento (valida campos y nombre único)
router.post('/',
  validateEventoBody,
  validateNombreEventoUnico,
  handleInputErrors,
  EventoControllers.crearEvento
);

// Actualizar un evento por ID (valida campos, pero no verifica duplicados)
router.put('/:IdEvento',
  validateIdEvento,
  validateEventoBody,
  handleInputErrors,
  EventoControllers.actualizarIdEvento
);

// Eliminar un evento por ID
router.delete('/:IdEvento',
  validateIdEvento,
  handleInputErrors,
  EventoControllers.eliminarIdEvento
);

export default router;
