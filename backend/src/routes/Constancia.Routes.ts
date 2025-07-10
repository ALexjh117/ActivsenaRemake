import { Router } from 'express';
import { body, param } from 'express-validator';
import { handleInputErrors } from '../middleware/validation';
import { validateConstanciaBody, validateIdConstancia, validateIdConstanciaYaExiste } from '../middleware/Constancia';
import { ConstanciaControllers } from '../controllers/ConstanciaController';

const router = Router();

// Obtener todas las constancias
router.get('/', ConstanciaControllers.getConstanciaAll);

// Obtener una constancia por ID
router.get(
  '/:ConstanciaId',
  validateIdConstancia,  // Validación para el ID de constancia
  handleInputErrors,      // Middleware para manejar los errores de validación
  ConstanciaControllers.getIdConstancia
);

// Crear una nueva constancia
router.post(
  '/',
  validateIdConstanciaYaExiste,  // Validación para verificar si la constancia ya existe
  validateConstanciaBody,        // Validación para los datos del cuerpo
  handleInputErrors,             // Middleware para manejar los errores de validación
  ConstanciaControllers.crearConstancia
);

// Actualizar una constancia por ID
router.put(
  '/:ConstanciaId',
  validateIdConstancia,         // Validación para el ID de constancia
  validateConstanciaBody,       // Validación para los datos del cuerpo
  handleInputErrors,            // Middleware para manejar los errores de validación
  ConstanciaControllers.actualizarIdConstancia
);

// Eliminar una constancia por ID
router.delete(
  '/:ConstanciaId',
  validateIdConstancia,         // Validación para el ID de constancia
  handleInputErrors,            // Middleware para manejar los errores de validación
  ConstanciaControllers.eliminarIdConstancia
);

export default router;
