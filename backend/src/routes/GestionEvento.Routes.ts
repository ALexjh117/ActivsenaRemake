import { Router } from "express";

import { GestionEventoController } from "../controllers/GestionEventoController";
import { handleInputErrors } from "../middleware/validation";
import { validateGestionEventoBody, validateGestionId } from "../middleware/GestionEvento";

const GestionEventoRoute  = Router()

GestionEventoRoute.get("/",
    handleInputErrors,
    GestionEventoController.getAll)

GestionEventoRoute.get("/:id", 
    validateGestionId,
    handleInputErrors,
    GestionEventoController.getGestionEventoId)

GestionEventoRoute.post("/", 
    validateGestionEventoBody,
    handleInputErrors,
    GestionEventoController.crearGestioEvento)

GestionEventoRoute.put("/:id", 
    validateGestionId,
    validateGestionEventoBody,
    handleInputErrors,
    GestionEventoController.actualizarGestionEventoId)

GestionEventoRoute.delete("/:id",
    validateGestionId,
    handleInputErrors,
    GestionEventoController.eliminarGestionEventoId)

export default GestionEventoRoute