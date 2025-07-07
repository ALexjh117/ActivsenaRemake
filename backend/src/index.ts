import app from './server';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import colors from 'colors'; 
import { db } from './config/db';
import fs from 'fs';
import path from 'path';

const PORT = 3001;

// 1️⃣ Crear servidor HTTP
const httpServer = http.createServer(app);

// 2️⃣ Crear instancia de Socket.IO
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*",
  },
});

// 3️⃣ Guardar io dentro de app
app.set("io", io);

async function startServer() {
    try {
        await db.authenticate(); 
        console.log(colors.blue.bold('Conexión exitosa a la Base de datos'));

        await db.sync();
        console.log(colors.blue.bold('Base de datos y modelos sincronizados.'));
        
        const uploadPath = path.join(__dirname, "../uploads");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
            console.log(colors.yellow("📁 Carpeta 'uploads' creada."));
        }

        // 4️⃣ Iniciar servidor HTTP
        httpServer.listen(PORT, '0.0.0.0', () => {
            console.log(colors.green.bold(`✅ Servidor escuchando en http://localhost:${PORT}`));
        });

    } catch (error) {
        console.error('❌ Error al conectar a la base de datos:', error);
    }
}

startServer();



