import type { Request, Response } from "express";
import { PlanificacionEvento } from "../models/PlanificacionEvento"; // Importa el modelo adecuado
import { GestionEvento } from "../models/GestionEvento";

import { error } from "console";
// esto esta bien , falta es traer al usuario quiem hizo esta peticion 
export class PlanificacionEventoControllers {


    static getPlanificarEventoAll = async (req: Request, res: Response) => {
        try {
            console.log('Desde GET /api/planificarEvento');

          
            const eventos = await PlanificacionEvento.findAll({
                order: [
                    ['FechaEvento', 'ASC'], 
                ],
            });

            res.json(eventos); 
        } catch (error) {
            console.error(error); 
            res.status(500).json({ error: 'Hubo un error' }); 
        }
    };

    
    static getIdPlanificarEvento = async (req: Request, res: Response) => {
        try {
            const { IdPlanificarE } = req.params;
            const evento = await PlanificacionEvento.findByPk(IdPlanificarE);
            if (!evento) {
                const error = new Error('Evento no encontrado');
                res.status(404).json({ error: error.message });
                return;
            }
            res.json(evento); 
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };

    
  
    
    static actualizarIdPlanificarEvento = async (req: Request, res: Response) => {
        try {
            const { IdPlanificarE } = req.params;
            const evento = await PlanificacionEvento.findByPk(IdPlanificarE);
            if (!evento) {
                const error = new Error('Evento no encontrado');
                res.status(404).json({ error: error.message });
                return;
            }
            await evento.update(req.body); 
            res.json('Evento planificado actualizado correctamente');
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };

    
    static eliminarIdPlanificarEvento = async (req: Request, res: Response) => {
        try {
            const { IdPlanificarE } = req.params;
            const evento = await PlanificacionEvento.findByPk(IdPlanificarE);
            if (!evento) {
                const error = new Error('Evento no encontrado');
                res.status(404).json({ error: error.message });
                return;
            }
            await evento.destroy(); 
            res.json('Evento planificado eliminado correctamente');
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Hubo un error' });
        }
    };



 

static crearPlanificacion = async (req: Request, res: Response) => {
  try {
    console.log("📌 Middleware alcanzado - crearPlanificacion");

    const {
      NombreEvento,
      FechaEvento,
      LugarDeEvento,
      TipoEvento,
      
      Recursos
    } = req.body;

    const IdUsuario = req.usuario?.IdUsuario;

    // Validar campos requeridos
    if (!NombreEvento || !FechaEvento || !LugarDeEvento || !IdUsuario) {
      const error = new Error("Faltan campos requeridos");
      res.status(400).json({ error: error.message });
      return;
    }

    // ✅ Primero crear gestión (autoincrementable)
    const nuevaGestion = await GestionEvento.create({
      Aprobar: "Pendiente"  // o el valor por defecto que uses
    });

    // ✅ Luego crear planificación con el IdGestionE generado
    const nuevaPlanificacion = await PlanificacionEvento.create({
      NombreEvento,
      FechaEvento,
      LugarDeEvento,
      Recursos: Recursos || null,
      TipoEvento,
      IdUsuario,
      IdGestionE: nuevaGestion.IdGestionE
    });

    res.status(201).json({
      message: "✅ Planificación creada exitosamente con gestión",
      planificacion: nuevaPlanificacion
    });
    return;

  } catch (error) {
    console.error("❌ Error al crear planificación:", error);
    res.status(500).json({
      error: "Error del servidor",
      message: (error as Error).message
    });
    return;
  }
};
// Asegúrate de tener esta línea arriba


}
