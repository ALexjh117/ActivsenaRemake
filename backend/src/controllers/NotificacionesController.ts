import { Request, Response } from "express";
import { Notificaciones } from "../models/Notificaciones";

export class NotificacionController {
  // ✅ Crear notificación
  static async crear(req: Request, res: Response) {
  try {
    const {
      Titulo,
      Mensaje,
      TipoNotificacion,
      FechaDeEnvio,
      IdEvento,
      IdUsuario,
      RutaDestino,
      imagenUrl
    } = req.body;

    const nueva = await Notificaciones.create({
      Titulo,
      Mensaje,
      TipoNotificacion,
      FechaDeEnvio,
      IdEvento,
      IdUsuario,
      RutaDestino,
      imagenUrl
    });

    // 🔥 Emitir notificación en tiempo real usando el socket guardado en app
    const io = req.app.get("io");
    io.emit("nuevaNotificacion", {
      ...nueva.toJSON() // envías toda la info al frontend
    });

    res.status(201).json({
      msg: "Notificación creada",
      notificacion: nueva,
    });
  } catch (error) {
    console.error("❌ Error al crear notificación:", error);
    res.status(500).json({ error: "Error al crear notificación" });
  }
}


  // ✅ Obtener todas las notificaciones de un usuario
 static async listarPorUsuario(req: Request, res: Response) {
  try {
    const { idUsuario } = req.params;

    const notificaciones = await Notificaciones.findAll({
      where: { IdUsuario: idUsuario },
      order: [["createdAt", "DESC"]],
      attributes: [
        "IdNotificacion",
        "Titulo",
        "Mensaje",
        "TipoNotificacion",
        "FechaDeEnvio",
        "Confirmado",
        "RutaDestino",   // ✅ importante
        "imagenUrl"      // ✅ importante
      ],
    });

    res.json(notificaciones);
  } catch (error) {
    console.error("❌ Error al listar notificaciones:", error);
    res.status(500).json({ error: "Error al listar notificaciones" });
  }
}


  // ✅ Marcar como confirmada
 // ✅ Marcar como confirmada
static async confirmar(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const noti = await Notificaciones.findByPk(id);
    if (!noti) {
    res.status(404).json({ error: "No encontrada" });
    return;
    }

    noti.Confirmado = true;
    await noti.save();

    res.json({ msg: "Notificación confirmada ✅" });
  } catch (error) {
    console.error("❌ Error al confirmar:", error);
    res.status(500).json({ error: "Error al confirmar" });
  }
}
}
