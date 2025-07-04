import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./style/Escaner.css";

const QRScannerHtml5 = () => {
  const qrCodeRegionId = 'reader';
  const [mensaje, setMensaje] = useState('');
  const [color, setColor] = useState('text-black');
  const [exito, setExito] = useState(false);
  const [escaneando, setEscaneando] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const navigate = useNavigate();

  const procesarQR = async (textoQR: string) => {
    console.log("📦 Contenido decodificado:", textoQR);

    try {
      const payload = JSON.parse(textoQR);
      const token = localStorage.getItem('token');

      if (payload.tipo === "alquiler") {
        // 🟢 Registro de alquiler desde QR
      const response = await axios.post(
  "http://localhost:3001/api/alquilerelementos/desde-qr",
  {
    IdElemento: payload.IdElemento,
    nombreElemento: payload.nombreElemento, // viene en el QR
    nombreAprendiz: payload.nombreAprendiz || "Aprendiz desconocido",
    fechaDevolucion: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // ejemplo: 2 días después
    observaciones: "Desde escáner QR",
    codigo: payload.codigo || `ALQ-${Date.now()}`
  },
  { headers: { Authorization: `Bearer ${token}` } }
);

        // Guardar datos para DetallesAlquiler
        localStorage.setItem("nuevoAlquiler", JSON.stringify({
          nombre: payload.nombre || "Elemento desconocido",
          nombreAprendiz: payload.nombreAprendiz || "Aprendiz",
          fechaEntrega: new Date().toISOString().split('T')[0],
          fechaDevolucion: "", // Pendiente
          observaciones: "Desde escáner QR",
          cumplioConEntrega: false,
          codigo: payload.codigo || `ALQ-${Date.now()}`,
          estado: "En uso"
        }));

        setMensaje("✅ Alquiler registrado correctamente");
        setColor("text-green-600");
        setExito(true);
        setEscaneando(false);

        setTimeout(() => {
          navigate("/detalles-alquiler");
        }, 2500);

      } else {
        // 🔵 Registro de asistencia
        const response = await axios.post(
          "http://192.168.10.111:3001/api/asistencia/qr",
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setMensaje(response.data.mensaje || "✅ Asistencia registrada");
        setColor("text-green-600");
        setExito(true);
        setEscaneando(false);

        setTimeout(() => {
          navigate("/historial");
        }, 2500);
      }

    } catch (error: any) {
      console.error("❌ Error procesando QR:", error);
      const msg = error.response?.data?.error || "Error al procesar el código QR";
      setMensaje(`❌ ${msg}`);
      setColor("text-red-600");
      setEscaneando(false);
    }
  };

  const iniciarEscaneo = () => {
    if (escaneando) return;

    const html5QrCode = new Html5Qrcode(qrCodeRegionId);
    scannerRef.current = html5QrCode;

    html5QrCode
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          html5QrCode.stop().then(() => html5QrCode.clear());
          procesarQR(decodedText);
        },
        () => {}
      )
      .then(() => setEscaneando(true))
      .catch((err) => {
        console.error("📷 Error al iniciar cámara:", err);
        setMensaje("Error al iniciar la cámara");
        setColor("text-red-600");
      });
  };

  useEffect(() => {
    return () => {
      const scanner = scannerRef.current;
      if (scanner && scanner.getState() === 2) {
        scanner.stop().then(() => scanner.clear()).catch(console.error);
      }
    };
  }, []);

  return (
    <div className="qr-container">
      <h2 className="qr-title">Escanea tu asistencia o alquiler</h2>

      {!escaneando && !exito && (
        <button onClick={iniciarEscaneo} className="qr-btn">
          📷 Abrir Cámara
        </button>
      )}

      {!exito && <div id={qrCodeRegionId} className="qr-reader" />}

      {exito && (
        <div className="qr-success">
          <div className="qr-check">✅</div>
          <p className="qr-success-text">¡Registro completado!</p>
        </div>
      )}

      <p className={`qr-message ${color}`}>{mensaje}</p>
    </div>
  );
};

export default QRScannerHtml5;
