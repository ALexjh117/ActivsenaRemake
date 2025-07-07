// Importación de módulos externos y middlewares
import { Router } from "express";
import { body, param } from "express-validator";
import { authorizeAdmin } from "../middleware/authotizeAdmin";
// Controlador
import { UsuarioController } from "../controllers/UsuarioController";

// Middlewares personalizados
import { handleInputErrors } from "../middleware/validation";
import { validateUsuarioBody, validateUsuarioNoExiste, validateUsuarioId } from "../middleware/Usuario";
import { authenticate } from "../middleware/auth";

// Configuración
import { limiter } from "../config/limiter";

import { upload } from "../middleware/Upload";
import type { RequestHandler } from "express";



// Inicialización del enrutador
const UsuarioRouter = Router();

// Middleware global: Limitador de peticiones para prevenir ataques de fuerza bruta
UsuarioRouter.use(limiter);

/* ---------------------------------------------
   RUTAS DE USUARIOS
----------------------------------------------*/

// Obtener todos los usuarios
UsuarioRouter.get("/", handleInputErrors, UsuarioController.getAll);

// Obtener el perfil del usuario autenticado
UsuarioRouter.get(
  "/user",
  authenticate,
  UsuarioController.usertraer as unknown as RequestHandler<any, any, any, any>
);


// Cambiar nombre
UsuarioRouter.put("/cambiar-nombre",
  authenticate,
  body("Nombre").notEmpty().withMessage("Nombre requerido"),
  handleInputErrors,
  UsuarioController.actualizarNombre as unknown as RequestHandler
);

// Cambiar correo
UsuarioRouter.put("/cambiar-correo",
  authenticate,
  body("Correo").isEmail().withMessage("Correo no válido"),
  handleInputErrors,
  UsuarioController.actualizarCorreo as unknown as RequestHandler
);

// Subir nueva imagen
UsuarioRouter.put("/cambiar-imagen",
  authenticate,
  upload.single("imagen"),
  UsuarioController.actualizarImagen as unknown as RequestHandler
);

// Actualizar contraseña actual
UsuarioRouter.post('/update-password',
  authenticate,
  body("Actualizar_Contrasena")
    .notEmpty().withMessage("La contraseña actual no puede ir vacía")
    .isLength({ min: 8 }).withMessage("La contraseña actual debe tener al menos 8 caracteres"),
  body("Contrasena")
    .isLength({ min: 8 }).withMessage("La contraseña nueva es muy corta, mínimo 8 caracteres"),
  handleInputErrors,
  UsuarioController.updateCurrentPassword
);

// Confirmar cuenta con token
UsuarioRouter.post("/confirm-account",
  body("token")
    .notEmpty()
    .isLength({ min: 6, max: 6 })
    .withMessage("Token no válido"),
  handleInputErrors,
  UsuarioController.confirmAccount
);

// Iniciar sesión
UsuarioRouter.post("/login",
  body("Correo").isEmail().withMessage("Correo no válido"),
  body("Contrasena").notEmpty().withMessage("La contraseña es obligatoria"),
  handleInputErrors,
  UsuarioController.login
);

// Solicitar restablecimiento de contraseña
UsuarioRouter.post("/forgot-password",
  body("Correo").isEmail().withMessage("Correo no válido"),
  handleInputErrors,
  UsuarioController.forgotContrasena
);

// Validar token de recuperación
UsuarioRouter.post("/validate-token",
  body("token").notEmpty().isLength({ min: 6, max: 6 }).withMessage("Token no válido"),
  handleInputErrors,
  UsuarioController.validateToken
);

// Restablecer contraseña con token


// Cambiar rol (solo admins)
UsuarioRouter.put("/cambiar-rol/:id",
  authenticate,
  authorizeAdmin,
  UsuarioController.cambiarRolUsuario
);

// Crear un nuevo usuario
UsuarioRouter.post("/",
  validateUsuarioNoExiste,
  validateUsuarioBody,
  handleInputErrors,
  UsuarioController.crearUsuario
);

// Actualizar solo teléfono
UsuarioRouter.put('/usuarios/:id', UsuarioController.actualizarTelefono);

// Obtener usuario por ID
UsuarioRouter.get("/:id",
  authenticate,
  validateUsuarioId,
  handleInputErrors,
  UsuarioController.getUsuarioId
);

// Actualizar usuario por ID (GENÉRICA, DEBE IR AL FINAL)
UsuarioRouter.put("/:id",
  authenticate,
  validateUsuarioId,
  validateUsuarioNoExiste,
  validateUsuarioBody,
  handleInputErrors,
  UsuarioController.actualizarUsuarioId
);

// Eliminar usuario por ID
UsuarioRouter.delete("/:id",
  validateUsuarioId,
  authenticate,
  handleInputErrors,
  UsuarioController.borrarUsuarioId
);

export default UsuarioRouter;