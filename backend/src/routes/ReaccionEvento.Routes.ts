import { Router } from "express";
import { ReaccionEventoController } from "../controllers/ReaccionEventoController";
import { verificarToken } from "../middleware/VerificarToken";
const router = Router();

router.post("/", verificarToken, ReaccionEventoController.registrarReaccion);
router.get("/evento/:idEvento", ReaccionEventoController.obtenerReaccionesPorEvento);
router.get("/evento/:idEvento/detalles", ReaccionEventoController.obtenerDetallesReacciones);

export default router;
