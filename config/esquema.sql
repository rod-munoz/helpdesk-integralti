-- Tablas de catálogo (datos estables)
CREATE TABLE
    IF NOT EXISTS roles (
        id_rol INT AUTO_INCREMENT PRIMARY KEY,
        nombre_rol VARCHAR(30) NOT NULL UNIQUE
    );

CREATE TABLE
    IF NOT EXISTS departamentos (
        id_departamento INT AUTO_INCREMENT PRIMARY KEY,
        nombre_departamento VARCHAR(60) NOT NULL UNIQUE
    );

CREATE TABLE
    IF NOT EXISTS categorias (
        id_categoria INT AUTO_INCREMENT PRIMARY KEY,
        nombre_categoria VARCHAR(80) NOT NULL UNIQUE,
        descripcion VARCHAR(200),
        activo BOOLEAN NOT NULL DEFAULT TRUE
    );

CREATE TABLE
    IF NOT EXISTS prioridades (
        id_prioridad INT AUTO_INCREMENT PRIMARY KEY,
        nombre_prioridad VARCHAR(20) NOT NULL UNIQUE,
        color VARCHAR(7)
    );

CREATE TABLE
    IF NOT EXISTS estados (
        id_estado INT AUTO_INCREMENT PRIMARY KEY,
        nombre_estado VARCHAR(30) NOT NULL UNIQUE
    );

-- Tablas operacionales
CREATE TABLE
    IF NOT EXISTS usuarios (
        id_usuario INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL,
        apellido VARCHAR(60) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        id_rol INT NOT NULL,
        id_departamento INT NOT NULL,
        activo BOOLEAN NOT NULL DEFAULT TRUE,
        fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_rol) REFERENCES roles (id_rol),
        FOREIGN KEY (id_departamento) REFERENCES departamentos (id_departamento)
    );

CREATE TABLE
    IF NOT EXISTS tickets (
        id_ticket INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(150) NOT NULL,
        descripcion TEXT NOT NULL,
        id_estado INT NOT NULL,
        id_prioridad INT NOT NULL,
        id_categoria INT NOT NULL,
        id_usuario_creador INT NOT NULL,
        fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        fecha_cierre DATETIME,
        FOREIGN KEY (id_estado) REFERENCES estados (id_estado),
        FOREIGN KEY (id_prioridad) REFERENCES prioridades (id_prioridad),
        FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria),
        FOREIGN KEY (id_usuario_creador) REFERENCES usuarios (id_usuario)
    );

CREATE TABLE
    IF NOT EXISTS respuestas (
        id_respuesta INT AUTO_INCREMENT PRIMARY KEY,
        id_ticket INT NOT NULL,
        id_usuario INT NOT NULL,
        contenido TEXT NOT NULL,
        fecha_respuesta DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_ticket) REFERENCES tickets (id_ticket),
        FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
    );

-- Datos iniciales obligatorios para que el sistema funcione
INSERT IGNORE INTO roles (nombre_rol)
VALUES
    ('Colaborador'),
    ('Técnico');

INSERT IGNORE INTO estados (nombre_estado)
VALUES
    ('Abierto'),
    ('En proceso'),
    ('Resuelto'),
    ('Cerrado');

INSERT IGNORE INTO prioridades (nombre_prioridad, color)
VALUES
    ('Alta', '#E53E3E'),
    ('Media', '#D69E2E'),
    ('Baja', '#38A169');

INSERT IGNORE INTO departamentos (nombre_departamento)
VALUES
    ('Soporte TI'),
    ('Administración'),
    ('Contabilidad'),
    ('Secretaría'),
    ('Gerencia');

INSERT IGNORE INTO categorias (nombre_categoria, descripcion)
VALUES
    ('Hardware', 'Problemas con equipos físicos'),
    (
        'Software',
        'Problemas con programas o aplicaciones'
    ),
    ('Red', 'Problemas de conectividad o internet'),
    (
        'Impresoras',
        'Problemas con impresoras o escáneres'
    ),
    (
        'Correo',
        'Problemas con cuentas de correo electrónico'
    ),
    ('Otros', 'Otros problemas técnicos');