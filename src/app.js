import express from 'express'
import cors from 'cors'
import ownerRoutes from './routes/owners/ownerRoutes.js'
import propertyRoutes from './routes/properties/propertiesRoutes.js';

const app = express()

app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

// Usar rutas separadas
app.use("/api/owners", ownerRoutes);
app.use("/api/properties", propertyRoutes);

// Exportamos la instancia de Express
export default app;