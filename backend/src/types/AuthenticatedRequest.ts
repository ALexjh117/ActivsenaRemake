import type { Request } from "express";
import type { Usuario } from "../models/Usuario";

export interface AuthenticatedRequest extends Request {
  usuario?: Usuario;
}
