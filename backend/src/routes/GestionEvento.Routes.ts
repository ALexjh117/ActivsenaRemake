import { Router } from "express";

import { GestionEventoController } from "../controllers/GestionEventoController";
import { handleInputErrors } from "../middleware/validation";
import { validateGestionEventoBody, validateGestionId } from "../middleware/GestionEvento";
import { verificarToken } from "../middleware/VerificarToken";
const GestionEventoRoute  = Router()

GestionEventoRoute.get("/",
    handleInputErrors,
    GestionEventoController.getAll)

GestionEventoRoute.get("/:IdGestionE", 
    validateGestionId,
    handleInputErrors,
    GestionEventoController.getGestionEventoId)

GestionEventoRoute.post("/", 
    validateGestionEventoBody,
    handleInputErrors,
    GestionEventoController.crearGestioEvento)

GestionEventoRoute.put("/:IdGestionE", 
    validateGestionId,
    validateGestionEventoBody,
    handleInputErrors,
    GestionEventoController.actualizarGestionEventoId)

GestionEventoRoute.delete("/:IdGestionE",
    validateGestionId,
    handleInputErrors,
    GestionEventoController.eliminarGestionEventoId)

GestionEventoRoute.put("/aprobar/:IdGestionE", verificarToken, GestionEventoController.aprobarGestionEvento);


export default GestionEventoRoute