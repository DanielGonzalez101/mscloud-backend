-- Tabla owners (se mantiene igual)
CREATE TABLE owners(
    id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    age INTEGER NOT NULL,
    id_number TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    -- Clave única para usar como referencia
    phone_number TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- Tabla properties (modificamos la relación)
CREATE TABLE properties (
    id INTEGER PRIMARY KEY,
    address TEXT NOT NULL,
    property_name TEXT NOT NULL,
    property_type TEXT NOT NULL CHECK (property_type IN ('unit', 'house')),
    owner_id INTEGER NOT NULL,
    -- Usamos el email como referencia
    status TEXT NOT NULL CHECK (status IN ('reserved', 'occupied', 'available')),
    -- Corregido "avaible" → "available"
    apartment_number TEXT,
    RNT TEXT,
    FOREIGN KEY (owner_id) REFERENCES owners(email) -- Relación por email
);

-- nombre, apellido, cedula, foto de la cedula, numero de celular, edad, correo
-- Tabla guess (corregida)
CREATE TABLE guests (
    -- Cambiado de "guess" a "guests"
    id INTEGER PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    age INTEGER NOT NULL,
    id_number VARCHAR NOT NULL UNIQUE,
    -- Agregada restricción UNIQUE
    photo_id MEDIUMBLOB NOT NULL,
    -- Corrección de "MEDIUMLOB" a "MEDIUMBLOB"
    email VARCHAR NOT NULL UNIQUE,
    phone_number VARCHAR NOT NULL,
    property_id INTEGER NOT NULL,
    check_in_date DATE,
    check_out_date DATE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- nombre apellido, cedula, foto de la cedula, 
-- numero de celular, edad, correo, tipo de trabajador
CREATE table worker (id INTEGER PRIMARY KEY);