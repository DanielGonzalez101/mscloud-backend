import { Router } from "express";
import client from "../../config/configDatabase.js";
import Property from "./propertyOB/propertyOB.js";
import { verifyToken } from "../../auth/authMiddleware.js";

const router = Router();

// Protegemos la ruta con verifyToken
router.post("/create-property", verifyToken, (req, res) => {
  const { address, property_name, property_type, status, apartment_number, RNT } = req.body;

  // Obtenemos el owner_id desde el token decodificado (req.user)
  const owner_id = req.user.id; // Aquí req.user se define en el middleware verifyToken

  // Instanciamos la clase Property
  const newProperty = new Property({
    address,
    property_name,
    property_type,
    status,
    apartment_number,
    RNT,
    owner_id
  });

  // Consulta SQL para insertar la nueva propiedad
  const sql = `
    INSERT INTO properties 
      (address, property_name, property_type, status, apartment_number, RNT, owner_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  client.query(
    sql,
    [
      newProperty.address,
      newProperty.property_name,
      newProperty.property_type,
      newProperty.status,
      newProperty.apartment_number,
      newProperty.RNT,
      newProperty.owner_id
    ],
    (err, results) => {
      if (err) {
        console.error("Error al crear la propiedad:", err);
        return res.status(500).json({ error: "Error al crear la propiedad." });
      }

      // Asignamos el id que MySQL generó
      newProperty.id = results.insertId;

      return res.status(201).json({
        message: "Propiedad creada exitosamente.",
        property: newProperty
      });
    }
  );
});

// 2. Obtener propiedades del usuario autenticado
router.get("/my-properties", verifyToken, (req, res) => {
  // El owner_id se extrae del token
  const ownerId = req.user.id;

  const sql = `SELECT * FROM properties WHERE owner_id = ?`;

  client.query(sql, [ownerId], (err, rows) => {
    if (err) {
      console.error("Error al obtener propiedades:", err);
      return res.status(500).json({ error: "Error al obtener propiedades." });
    }

    res.status(200).json(rows);
  });
});

export default router;
