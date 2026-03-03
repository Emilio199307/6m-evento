const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Base de datos SQLite
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS emprendimientos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT, tipo TEXT, descripcion TEXT, necesidades TEXT,
        equipo INTEGER, contacto TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS testimonios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo TEXT, texto TEXT, leer_microfono BOOLEAN, publicar_muro BOOLEAN,
        aprobado BOOLEAN DEFAULT 0
    )`);
});

// Rutas
app.post('/api/emprendimientos', (req, res) => {
    const { nombre, tipo, descripcion, necesidades, equipo, contacto } = req.body;
    db.run(`INSERT INTO emprendimientos (nombre, tipo, descripcion, necesidades, equipo, contacto) VALUES (?, ?, ?, ?, ?, ?)`,
        [nombre, tipo, descripcion, necesidades, equipo, contacto], 
        (err) => {
            if (err) return res.status(500).send("Error");
            res.status(200).send("Guardado");
        }
    );
});

app.post('/api/testimonios', (req, res) => {
    const { tipo, texto, leer_microfono, publicar_muro } = req.body;
    db.run(`INSERT INTO testimonios (tipo, texto, leer_microfono, publicar_muro) VALUES (?, ?, ?, ?)`,
        [tipo, texto, leer_microfono, publicar_muro], 
        (err) => {
            if (err) return res.status(500).send("Error");
            res.status(200).send("Recibido de forma anónima");
        }
    );
});

const basicAuth = (req, res, next) => {
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');
    if (login === 'admin' && password === 'flacso8m') return next();
    res.set('WWW-Authenticate', 'Basic realm="401"');
    res.status(401).send('Acceso denegado.');
};

app.get('/api/admin/logistica', basicAuth, (req, res) => {
    db.all(`SELECT necesidades FROM emprendimientos`, [], (err, rows) => {
        if (err) return res.status(500).send("Error");
        let conteo = { "Stand": 0, "Mesa": 0, "Silla": 0, "Carpa": 0, "Punto eléctrico": 0 };
        rows.forEach(row => {
            const nec = JSON.parse(row.necesidades);
            nec.forEach(item => { if(conteo[item] !== undefined) conteo[item]++; });
        });
        res.json({ total_emprendimientos: rows.length, resumen: conteo });
    });
});

// ¡ESTA ES LA PARTE QUE MANTIENE EL SERVIDOR ENCENDIDO!
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});