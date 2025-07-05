import type { Request, Response } from "express";
import { Feedback } from "../models/Feedback";
//usuarips que han cmentado el feddback del evento x , ya sea por id o por nombre
export class FeedbackController {

    static getAllFeedbacks = async (req: Request, res: Response) => {
        try {
            const feedbacks = await Feedback.findAll({
                order: [['FechaEnvio', 'ASC']],
            });
            res.json(feedbacks);
        } catch (error) {
            console.error('Error al obtener feedbacks:', error);
            res.status(500).json({ error: 'Hubo un error al obtener los feedbacks' });
        }
    };

    static getFeedbackById = async (req: Request, res: Response) => {
        try {
            const { IdFeedback } = req.params;
            const feedback = await Feedback.findByPk(IdFeedback);

            if (!feedback) {
                res.status(404).json({ error: 'Feedback no encontrado' });
                return;
            }

            res.json(feedback);
        } catch (error) {
            console.error('Error al obtener feedback:', error);
            res.status(500).json({ error: 'Hubo un error al buscar el feedback' });
        }
    };

    static crearFeedback = async (req: Request, res: Response) => {
        try {
            const feedback = new Feedback(req.body);
            await feedback.save();
            res.status(201).json('Feedback creado exitosamente');
        } catch (error) {
            console.error('Error al crear feedback:', error);
            res.status(500).json({ error: 'Hubo un error al crear el feedback' });
        }
    };

    static actualizarFeedbackById = async (req: Request, res: Response) => {
        try {
            const { IdFeedback } = req.params;
            const feedback = await Feedback.findByPk(IdFeedback);

            if (!feedback) {
                res.status(404).json({ error: 'Feedback no encontrado' });
                return;
            }

            await feedback.update(req.body);
            res.json('Feedback actualizado correctamente');
        } catch (error) {
            console.error('Error al actualizar feedback:', error);
            res.status(500).json({ error: 'Hubo un error al actualizar el feedback' });
        }
    };

    static eliminarFeedbackById = async (req: Request, res: Response) => {
        try {
            const { IdFeedback } = req.params;
            const feedback = await Feedback.findByPk(IdFeedback);

            if (!feedback) {
            res.status(404).json({ error: 'Feedback no encontrado' });
            return;
            }

            await feedback.destroy();
            res.json('Feedback eliminado correctamente');
        } catch (error) {
            console.error('Error al eliminar feedback:', error);
            res.status(500).json({ error: 'Hubo un error al eliminar el feedback' });
        }
    };
}