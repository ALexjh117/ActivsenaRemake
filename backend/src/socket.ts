import { Server } from "socket.io";

import { createServer } from "http";
import app from "./server"; // este es tu `express()` exportado en server.ts

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // frontend
    methods: ["GET", "POST"],
  },
});


export { io, httpServer };
