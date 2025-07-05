export interface UsuarioAutenticadoPayload {
  IdUsuario: number;
  Nombre: string;
  Correo?: string; // si no lo usas en el token, lo puedes omitir
  IdRol: number;
}
