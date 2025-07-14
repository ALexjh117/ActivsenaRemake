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
    imagenUbicacion: null,
    imagenPerfil: null,
    aceptaTerminos: false,
    Rol: '',
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
        else if (!/^\d{1,50}$/.test(valor)) nuevosErrores[nombre] = 'Solo números';
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
    const { name, value, type, checked, files } = e.target;

    if (type === 'file') {
      setFormulario({ ...formulario, [name]: files[0] });
    } else {
      const nuevoValor = type === 'checkbox' ? checked : value;
      setFormulario({ ...formulario, [name]: nuevoValor });

      if (type !== 'checkbox') validarCampo(name, value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    // Validar campos obligatorios
    Object.keys(formulario).forEach((campo) => {
      if (
        campo !== 'Telefono' &&
        campo !== 'aceptaTerminos' &&
        campo !== 'imagenUbicacion' &&
        campo !== 'imagenPerfil'
      ) {
        validarCampo(campo, formulario[campo]);
      }
    });

    if (Object.keys(errores).length === 0 && formulario.aceptaTerminos && formulario.Rol) {
      try {
        const formData = new FormData();
        for (const key in formulario) {
          if (formulario[key] !== null) {
            formData.append(key, formulario[key]);
          }
        }

        await api.post('/usuario/crear-usuario', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setMensaje('✅ Registro exitoso.');
        setTipoMensaje('exito');

        setTimeout(() => {
          navigate('/Cuenta');
        }, 2000);
      } catch (err) {
        console.error('❌ Error al registrar:', err);
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

      <form className="formulario-registro" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="grupo-campo-registro">
          <label>Identificación*</label>
          <input type="text" name="IdentificacionUsuario" value={formulario.IdentificacionUsuario} onChange={handleChange} />
          {errores.IdentificacionUsuario && <p>{errores.IdentificacionUsuario}</p>}
        </div>

        <div className="grupo-campo-registro">
          <label>Nombre*</label>
          <input type="text" name="Nombre" value={formulario.Nombre} onChange={handleChange} />
          {errores.Nombre && <p>{errores.Nombre}</p>}
        </div>

        <div className="grupo-campo-registro">
          <label>Apellido*</label>
          <input type="text" name="Apellido" value={formulario.Apellido} onChange={handleChange} />
          {errores.Apellido && <p>{errores.Apellido}</p>}
        </div>

        <div className="grupo-campo-registro">
          <label>Correo electrónico*</label>
          <input type="email" name="Correo" value={formulario.Correo} onChange={handleChange} />
          {errores.Correo && <p>{errores.Correo}</p>}
        </div>

        <div className="grupo-campo-registro">
          <label>Teléfono (opcional)</label>
          <input type="tel" name="Telefono" value={formulario.Telefono} onChange={handleChange} />
        </div>

        <div className="grupo-campo-registro">
          <label>Contraseña*</label>
          <input type="password" name="Contrasena" value={formulario.Contrasena} onChange={handleChange} />
          {errores.Contrasena && <p>{errores.Contrasena}</p>}
        </div>

        <div className="grupo-campo-registro">
          <label>Rol*</label>
          <select name="Rol" value={formulario.Rol} onChange={handleChange} required>
            <option value="">Selecciona un rol</option>
            <option value="Administrador">Administrador</option>
            <option value="Instructor">Instructor</option>
          </select>
        </div>

        {/* CAMPOS EXCLUSIVOS DE INSTRUCTOR */}
        {formulario.Rol === 'Instructor' && (
          <>
            <div className="grupo-campo-registro">
              <label>Profesión*</label>
              <input type="text" name="profesion" value={formulario.profesion} onChange={handleChange} required />
            </div>

            <div className="grupo-campo-registro">
              <label>Ubicación*</label>
              <input type="text" name="ubicacion" value={formulario.ubicacion} onChange={handleChange} required />
            </div>

            <div className="grupo-campo-registro">
              <label>Imagen del lugar (Ubicación)*</label>
              <input type="file" name="imagenUbicacion" accept="image/*" onChange={handleChange} required />
            </div>

            <div className="grupo-campo-registro">
              <label>Imagen de perfil del instructor*</label>
              <input type="file" name="imagenPerfil" accept="image/*" onChange={handleChange} required />
            </div>
          </>
        )}

        <div className="grupo-campo-registro">
          <input type="checkbox" name="aceptaTerminos" checked={formulario.aceptaTerminos} onChange={handleChange} />
          <label>Acepto los términos y condiciones</label>
        </div>

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
