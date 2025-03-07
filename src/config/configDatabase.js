import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2';

// Obtenemos la configuración desde variables de entorno
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

// Creamos la conexión a MySQL
const client = mysql.createConnection(dbConfig);

// Iniciamos la conexión y manejamos errores
client.connect((err) => {
    if (err) {
        console.error("Error al conectar a la base de datos MySQL:", err.message);
    } else {
        console.log("Conectado a la base de datos MySQL");
    }
});

// Exportamos el cliente para usarlo en otros módulos
export default client;
