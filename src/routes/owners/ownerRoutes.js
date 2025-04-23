// ownerRoutes.js
import { Router } from "express";
import client from "../../config/configDatabase.js";
import Owner from "./obOwner/OwnerOb.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

dotenv.config();

const router = Router();

// Usamos la clave secreta desde .env (o una por defecto si no existe)
const SECRET_KEY = process.env.SECRET_KEY;

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña son requeridos" });
  }

  const sql = `SELECT id, first_name, last_name, age, id_number, email, phone_number, password FROM owners WHERE email = ? LIMIT 1`;

  client.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("Error al buscar el usuario:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const user = results[0];

    // Compara la contraseña ingresada con la almacenada en la base de datos
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Genera el token sin guardarlo en la BD
    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: "7d" }, // El token expira en 7 días
    );

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        age: user.age,
        id_number: user.id_number,
        email: user.email,
        phone_number: user.phone_number,
      },
    });
  });
});

router.post("/register-owner", async (req, res) => {
  const {
    first_name,
    last_name,
    age,
    id_number,
    email,
    phone_number,
    password,
  } = req.body;

  if (
    !first_name ||
    !last_name ||
    !age ||
    !id_number ||
    !email ||
    !phone_number ||
    !password
  ) {
    return res
      .status(400)
      .json({ error: "Todos los campos son obligatorios." });
  }

  const obOwner = new Owner({
    first_name,
    last_name,
    age,
    id_number,
    email,
    phone_number,
    password,
  });

  // 1. Verificar si ya existe un usuario con el mismo email, teléfono o identificación
  const checkSql = `SELECT email, phone_number, id_number FROM owners WHERE email = ? OR phone_number = ? OR id_number = ? LIMIT 1`;

  client.query(
    checkSql,
    [obOwner.email, obOwner.phone_number, obOwner.id_number],
    async (err, rows) => {
      if (err) {
        console.error("Error al verificar duplicados:", err);
        return res.status(500).json({ error: "Error en el servidor." });
      }

      if (rows.length > 0) {
        const existingRecord = rows[0];
        if (existingRecord.email === obOwner.email) {
          return res
            .status(400)
            .json({ error: "El email ya está registrado." });
        }
        if (existingRecord.phone_number === obOwner.phone_number) {
          return res
            .status(400)
            .json({ error: "El teléfono ya está registrado." });
        }
        if (existingRecord.id_number === obOwner.id_number) {
          return res
            .status(400)
            .json({ error: "El número de identificación ya está registrado." });
        }
      }

      try {
        // 2. Encriptar la contraseña antes de guardarla
        const salt = await bcrypt.genSalt(10);
        obOwner.password = await bcrypt.hash(password, salt);

        // 3. Insertar en la base de datos
        const insertSql = `INSERT INTO owners (first_name, last_name, age, id_number, email, phone_number, password) VALUES (?, ?, ?, ?, ?, ?, ?)`;

        client.query(
          insertSql,
          [
            obOwner.first_name,
            obOwner.last_name,
            obOwner.age,
            obOwner.id_number,
            obOwner.email,
            obOwner.phone_number,
            obOwner.password,
          ],
          (err, results) => {
            if (err) {
              console.error("Error al registrar el propietario:", err);
              return res
                .status(500)
                .json({ error: "Error al registrar el propietario." });
            }

            obOwner.id = results.insertId;

            // 4. Generar token JWT
            const token = jwt.sign(
              { id: obOwner.id, email: obOwner.email },
              SECRET_KEY,
              { expiresIn: "7d" }, // Token válido por 7 días
            );

            res.status(201).json({
              message: "Propietario registrado exitosamente.",
              id: obOwner.id,
              token: token, // Se envía el token en la respuesta
            });
          },
        );
      } catch (error) {
        console.error("Error al encriptar la contraseña:", error);
        return res.status(500).json({ error: "Error en el servidor." });
      }
    },
  );
});

router.get("/get-owners", (req, res) => {
  const sql =
    "SELECT id, first_name, last_name, email, phone_number FROM owners";

  client.query(sql, (err, results) => {
    if (err) {
      console.error("Error al obtener propietarios:", err);
      return res.status(500).json({ error: "Error al obtener propietarios." });
    }

    res.status(200).json(results);
  });
});

export default router;
