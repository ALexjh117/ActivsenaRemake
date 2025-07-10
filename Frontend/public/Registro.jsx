import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../src/services/api';
import './styles/registro.css';

const Registro = () => {
  const [formulario, setFormulario] = useState({
    IdentificacionUsuario: '',
    Nombre: '',
    Apellido: '',
    Correo: '',
    Telefono: '',
    Contrasena: '',
    profesion: '',
    ubicacion: '',
    imagen: '',
    aceptaTerminos: false,
    Rol: '', // "Administrador" o "Instructor"
  });

  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const validarCampo = (nombre, valor) => {
    const nuevosErrores = { ...errores };

    switch (nombre) {
      case 'IdentificacionUsuario':
        if (!valor) nuevosErrores[nombre] = 'Campo obligatorio';
        else if (!/^\d{1,50}$/.test(valor)) nuevosErrores[nombre] = 'Debe contener solo números';
        else delete nuevosErrores[nombre];
        break;
      case 'Nombre':
      case 'Apellido':
        if (!valor) nuevosErrores[nombre] = 'Campo obligatorio';
        else if (valor.length > 100) nuevosErrores[nombre] = 'Máx 100 caracteres';
        else delete nuevosErrores[nombre];
        break;
      case 'Correo':
        if (!valor) nuevosErrores[nombre] = 'Campo obligatorio';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) nuevosErrores[nombre] = 'Correo inválido';
        else delete nuevosErrores[nombre];
        break;
      case 'Contrasena':
        if (!valor) nuevosErrores[nombre] = 'Campo obligatorio';
        else if (valor.length < 6) nuevosErrores[nombre] = 'Mínimo 6 caracteres';
        else delete nuevosErrores[nombre];
        break;
      default:
        break;
    }

    setErrores(nuevosErrores);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nuevoValor = type === 'checkbox' ? checked : value;

    setFormulario({ ...formulario, [name]: nuevoValor });

    if (type !== 'checkbox') validarCampo(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    Object.keys(formulario).forEach((campo) => {
      if (campo !== 'Telefono' && campo !== 'aceptaTerminos') {
        validarCampo(campo, formulario[campo]);
      }
    });

    if (Object.keys(errores).length === 0 && formulario.aceptaTerminos && formulario.Rol) {
      try {
        const response = await api.post('/usuario/crear-usuario', formulario);

        setMensaje('✅ Registro exitoso.');
        setTipoMensaje('exito');

        setTimeout(() => {
          if (formulario.Rol === 'Administrador') navigate('/dash');
          else if (formulario.Rol === 'Instructor') navigate('/dashin');
        }, 2000);
      } catch (error) {
        console.error('Error al registrar:', error);
        setMensaje('❌ Error al registrar.');
        setTipoMensaje('error');
      }
    } else {
      setMensaje('❌ Corrige los errores e intenta nuevamente.');
      setTipoMensaje('error');
    }

    setCargando(false);
  };

  return (
    <div className="contenedor-registro">
      <h2 className="tituloUnico registro-activsena">Registrar Usuario (Admin o Instructor)</h2>

      <form className="formulario-registro" onSubmit={handleSubmit}>
        {/* Identificación */}
        <div className="grupo-campo-registro">
          <label>Identificación*</label>
          <input
            type="text"
            name="IdentificacionUsuario"
            value={formulario.IdentificacionUsuario}
            onChange={handleChange}
            className="campo-input-registro"
          />
          {errores.IdentificacionUsuario && <p>{errores.IdentificacionUsuario}</p>}
        </div>

        {/* Nombre y Apellido */}
        <div className="grupo-campo-registro">
          <label>Nombre*</label>
          <input
            type="text"
            name="Nombre"
            value={formulario.Nombre}
            onChange={handleChange}
            className="campo-input-registro"
          />
          {errores.Nombre && <p>{errores.Nombre}</p>}
        </div>

        <div className="grupo-campo-registro">
          <label>Apellido*</label>
          <input
            type="text"
            name="Apellido"
            value={formulario.Apellido}
            onChange={handleChange}
            className="campo-input-registro"
          />
          {errores.Apellido && <p>{errores.Apellido}</p>}
        </div>

        {/* Correo */}
        <div className="grupo-campo-registro">
          <label>Correo electrónico*</label>
          <input
            type="email"
            name="Correo"
            value={formulario.Correo}
            onChange={handleChange}
            className="campo-input-registro"
          />
          {errores.Correo && <p>{errores.Correo}</p>}
        </div>

        {/* Teléfono */}
        <div className="grupo-campo-registro">
          <label>Teléfono (opcional)</label>
          <input
            type="tel"
            name="Telefono"
            value={formulario.Telefono}
            onChange={handleChange}
            className="campo-input-registro"
          />
        </div>

        {/* Contraseña */}
        <div className="grupo-campo-registro">
          <label>Contraseña*</label>
          <input
            type="password"
            name="Contrasena"
            value={formulario.Contrasena}
            onChange={handleChange}
            className="campo-input-registro"
          />
          {errores.Contrasena && <p>{errores.Contrasena}</p>}
        </div>

        {/* Selección de Rol */}
        <div className="grupo-campo-registro">
          <label>Rol*</label>
          <select name="Rol" value={formulario.Rol} onChange={handleChange} className="campo-input-registro" required>
            <option value="">Selecciona un rol</option>
            <option value="Administrador">Administrador</option>
            <option value="Instructor">Instructor</option>
          </select>
        </div>

        {/* SOLO SI ES INSTRUCTOR */}
        {formulario.Rol === 'Instructor' && (
          <>
            {/* Profesión */}
            <div className="grupo-campo-registro">
              <label>Profesión*</label>
              <input
                type="text"
                name="profesion"
                value={formulario.profesion}
                onChange={handleChange}
                className="campo-input-registro"
                required
              />
            </div>

            {/* Ubicación */}
            <div className="grupo-campo-registro">
              <label>Ubicación*</label>
              <input
                type="text"
                name="ubicacion"
                value={formulario.ubicacion}
                onChange={handleChange}
                className="campo-input-registro"
                required
              />
            </div>

            {/* Imagen */}
            <div className="grupo-campo-registro">
              <label>Imagen del lugar (base64)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFormulario(prev => ({ ...prev, imagen: reader.result }));
                  };
                  reader.readAsDataURL(file);
                }}
                className="campo-input-registro"
              />
              {formulario.imagen && (
                <img
                  src={formulario.imagen}
                  alt="Vista previa"
                  style={{ maxWidth: '200px', marginTop: '10px', borderRadius: '10px' }}
                />
              )}
            </div>
          </>
        )}

        {/* Términos y condiciones */}
        <div className="grupo-campo-registro">
          <input
            type="checkbox"
            name="aceptaTerminos"
            checked={formulario.aceptaTerminos}
            onChange={handleChange}
          />
          <label>Acepto los términos y condiciones</label>
        </div>

        {/* Botón */}
        <button type="submit" className="boton-registro" disabled={cargando}>
          {cargando ? 'Registrando...' : 'Registrar'}
        </button>

        {mensaje && (
          <p className={tipoMensaje === 'exito' ? 'mensaje-exito' : 'mensaje-error'}>{mensaje}</p>
        )}
      </form>
    </div>
  );
};

export default Registro;
