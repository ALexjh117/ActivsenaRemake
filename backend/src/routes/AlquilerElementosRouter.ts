import { Router } from 'express';
import { body, param } from 'express-validator';
import { handleInputErrors } from '../middleware/validation';
import {
  validateAlquilerBody,
  validateIdAlquiler,
  validateIdAlquilerYaExiste,
  validateIdUsuario
} from '../middleware/AlquilerElementos';
import { verificarToken } from '../middleware/VerificarToken'; 
import { AlquilerElementosControllers } from '../controllers/AlquilerElementoControllers'; // <-- corregido import
import multer from 'multer';
import { CatalogoController } from '../controllers/CatalogoAlquiler';

const router = Router();

// Obtener todos los alquileres
router.get('/', AlquilerElementosControllers.getAlquilerElementosAll);

// Crear un alquiler
router.post(
  '/',
  validateIdAlquilerYaExiste,
  validateAlquilerBody,
  handleInputErrors,
  AlquilerElementosControllers.crearAlquiler
);

// Actualizar un alquiler por ID
router.put(
  '/:IdAlquiler',
  validateIdAlquiler,
  validateAlquilerBody,
  handleInputErrors,
  AlquilerElementosControllers.actualizarIdAlquiler
);

// Eliminar un alquiler por ID
router.delete(
  '/:IdAlquiler',
  validateIdAlquiler,
  handleInputErrors,
  AlquilerElementosControllers.eliminarIdAlquiler
);

// Obtener alquileres por usuario
router.get(
  '/usuario/:IdUsuario',
  validateIdUsuario,
  handleInputErrors,
  AlquilerElementosControllers.getAlquileresPorUsuario
);

// Marcar devolución
router.put("/alquiler/:IdAlquiler/devolver", AlquilerElementosControllers.devolverElemento);

// Marcar cumplido
router.put("/alquiler/:IdAlquiler/cumplido", AlquilerElementosControllers.marcarComoCumplido);

// Registrar alquiler desde QR
router.post(
  '/desde-qr',
  verificarToken, // extrae IdUsuario desde token
  AlquilerElementosControllers.registrarDesdeQR
);

router.post('/qr', verificarToken, AlquilerElementosControllers.registrarDesdeQR);

// Configuración Multer para subida de imágenes
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

// Subir elementos al catálogo
router.post('/catalogo', upload.single('imagen'), (req, res) => {
  const io = req.app.get('io');
  (req as any).io = io; // inyectamos socket.io si usas
  CatalogoController.subirElemento(req as any, res);
});

router.get('/catalogo', CatalogoController.getCatalogo);

router.put(
  '/catalogo/:IdAlquiler/imagen',
  upload.single('imagen'),
  CatalogoController.actualizarImagen
);

router.delete('/catalogo/:IdAlquiler', CatalogoController.eliminarElemento);

export default router;
