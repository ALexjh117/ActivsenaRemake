import type { Request, Response } from "express";
import { Actividad } from "../models/Actividad";
import { Evento } from "../models/Evento";
import * as QRCode from 'qrcode';
import { enviarNotificacion } from '../services/notificacionesService';
import { Usuario } from '../models/Usuario'; 


export class ActividadControllers {
  static getActividadAll = async (req: Request, res: Response) => {
    try {
      const actividades = await Actividad.findAll({
        order: [['createdAt', 'ASC']],
        include: [Evento],
      });

      res.json(actividades);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Hubo un error' });
    }
  };

  static getIdActividad = async (req: Request, res: Response) => {
    try {
      const { IdActividad } = req.params;
      const actividad = await Actividad.findByPk(IdActividad, {
        include: [Evento],
      });

      if (!actividad) {
        res.status(404).json({ error: 'Actividad no encontrada' });
        return;
      }

      res.json(actividad);
    } catch (error) {
      res.status(500).json({ error: 'hubo un error' });
    }
  };

static crearActividad = async (req: Request, res: Response) => {
  try {
    console.log("💡 Middleware alcanzado");

    // ✅ Normalizar body para evitar problemas con "null prototype"
    const body = JSON.parse(JSON.stringify(req.body));

    const {
      NombreActi,
      Descripcion,
      FechaInicio,
      FechaFin,
      HoraInicio,
      HoraFin,
      TipoLudica,
      IdEvento,
      Ubicacion
    } = body;

    const image = req.file?.filename;

    // 🔍 Logs de tipo de cada campo
    console.log("🧪 Tipo de cada campo:");
    console.log("NombreActi:", NombreActi, typeof NombreActi);
    console.log("FechaInicio:", FechaInicio, typeof FechaInicio);
    console.log("FechaFin:", FechaFin, typeof FechaFin);
    console.log("HoraInicio:", HoraInicio, typeof HoraInicio);
    console.log("HoraFin:", HoraFin, typeof HoraFin);
    console.log("TipoLudica:", TipoLudica, typeof TipoLudica);
    console.log("Ubicacion:", Ubicacion, typeof Ubicacion);

    // Función defensiva para validar campos vacíos
    const isEmpty = (val: any) => {
      if (typeof val === "string") return val.trim() === "";
      return val === undefined || val === null;
    };

    // Validar campos requeridos
    if (
      isEmpty(NombreActi) ||
      isEmpty(FechaInicio) ||
      isEmpty(FechaFin) ||
      isEmpty(HoraInicio) ||
      isEmpty(HoraFin) ||
      isEmpty(TipoLudica) ||
      isEmpty(Ubicacion)
    ) {
      console.log("❌ Validación fallida - campos inválidos:", {
        NombreActi,
        FechaInicio,
        FechaFin,
        HoraInicio,
        HoraFin,
        TipoLudica,
        Ubicacion
      });
      res.status(400).json({ error: "⚠️ Faltan campos requeridos" });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: "⚠️ Debes subir una imagen" });
      return;
    }

    // ✅ Crear actividad
    const nuevaActividad = await Actividad.create({
      NombreActi,
      Descripcion: Descripcion || null,
      FechaInicio: new Date(FechaInicio),
      FechaFin: new Date(FechaFin),
      HoraInicio,
      HoraFin,
      TipoLudica,
      IdEvento: IdEvento ? parseInt(IdEvento) : null,
      Ubicacion,
      Imagen: image,
      IdUsuario: parseInt(body.IdUsuario)  
    });

    // 🔍 Buscar evento (si viene)
    const evento = IdEvento ? await Evento.findByPk(parseInt(IdEvento)) : null;

    // 🧾 Payload para QR entrada y salida
    const payloadEntrada = {
      IdActividad: nuevaActividad.IdActividad,
      tipo: 'entrada',
      nombreActividad: nuevaActividad.NombreActi,
      nombreEvento: evento?.NombreEvento || 'Evento sin nombre'
    };
    const payloadSalida = {
      IdActividad: nuevaActividad.IdActividad,
      tipo: 'salida',
      nombreActividad: nuevaActividad.NombreActi,
      nombreEvento: evento?.NombreEvento || 'Evento sin nombre'
    };

    // 🧬 Generar QRs
    const qrEntrada = await QRCode.toDataURL(JSON.stringify(payloadEntrada));
    const qrSalida = await QRCode.toDataURL(JSON.stringify(payloadSalida));

    // 💾 Guardar QRs en actividad
    nuevaActividad.CodigoQR = qrEntrada;
    nuevaActividad.CodigoQRSalida = qrSalida;
    await nuevaActividad.save();
// 🧠 Buscar todos los aprendices para notificarles
const aprendices = await Usuario.findAll({ where: { IdRol: 2 } }); // 🔁
const idsAprendices = aprendices.map(u => u.IdUsuario);

// 📩 Enviar notificaciones a los aprendices
await enviarNotificacion({
  titulo: 'Nueva actividad disponible',
  mensaje: `Participa en la actividad "${nuevaActividad.NombreActi}" del evento "${evento?.NombreEvento || 'Sin evento'}".`,
  tipo: 'Actividad',
  idUsuarios: idsAprendices,
  idEvento: nuevaActividad.IdEvento ?? null // <-- si no hay evento, se pasa null
});

    // ✅ Respuesta final
    res.status(201).json({
      message: "✅ Actividad creada exitosamente con QRs",
      actividad: nuevaActividad
    });
    return;

  } catch (error) {
    console.error("❌ Error al crear actividad:", error);
    res.status(500).json({
      error: "Hubo un error en el servidor",
      message: (error as Error).message
    });
    return;
  }
};

  static actualizarIdActividad = async (req: Request, res: Response) => {
    try {
      const { IdActividad } = req.params;
      const actividad = await Actividad.findByPk(IdActividad);
      if (!actividad) {
        res.status(404).json({ error: 'Actividad no encontrada' });
        return;
      }
      await actividad.update(req.body);
      res.json(actividad);
    } catch (error) {
      res.status(500).json({ error: 'hubo un error' });
    }
  };

  static getActividadesPorEvento = async (req: Request, res: Response) => {
    try {
      const { IdEvento } = req.params;
      const actividades = await Actividad.findAll({
        where: { IdEvento }
      });
      res.json(actividades);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener actividades por evento' });
    }
  };

  static eliminarIdActividad = async (req: Request, res: Response) => {
    try {
      const { IdActividad } = req.params;
      const actividad = await Actividad.findByPk(IdActividad);
      if (!actividad) {
        res.status(404).json({ error: 'Actividad no encontrada' });
        return;
      }
      await actividad.destroy();
      res.json({ message: 'Actividad eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'hubo un error' });
    }
  };
}