const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Conexión MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234", 
    database: "ejemplo"  // Cambia por tu DB real
});

// ✅ Obtener todas las categorías
app.get("/categories", (req, res) => {
    db.query("SELECT * FROM products_category", (err, results) => {
        if (err) return res.status(500).json({ detail: "Error interno en la base de datos" });
        res.json(results);
    });
});

// ✅ Obtener una categoría por ID
app.get("/categories/:id", (req, res) => {
    db.query("SELECT * FROM products_category WHERE id = ?", [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ detail: "Error interno en la base de datos" });
        if (results.length === 0) return res.status(404).json({ detail: "Categoría no encontrada" });
        res.json(results[0]);
    });
});

// ✅ Crear una nueva categoría
app.post("/categories", (req, res) => {
    const { name } = req.body;
    if (!name || name.trim() === "") {
        return res.status(400).json({ name: ["El nombre es obligatorio"] });
    }
    db.query("INSERT INTO products_category (name) VALUES (?)", [name], (err, results) => {
        if (err) return res.status(500).json({ detail: "Error interno en la base de datos" });
        res.json({ id: results.insertId, name });
    });
});

// ✅ Actualizar una categoría
app.put("/categories/:id", (req, res) => {
    const { name } = req.body;
    if (!name || name.trim() === "") {
        return res.status(400).json({ name: ["El nombre es obligatorio"] });
    }
    db.query("UPDATE products_category SET name = ? WHERE id = ?", [name, req.params.id], (err, results) => {
        if (err) return res.status(500).json({ detail: "Error interno en la base de datos" });
        if (results.affectedRows === 0) return res.status(404).json({ detail: "No se encontró la categoría" });
        res.json({ id: req.params.id, name });
    });
});

// ✅ Eliminar una categoría
app.delete("/categories/:id", (req, res) => {
    db.query("DELETE FROM products_category WHERE id = ?", [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ detail: "Error interno en la base de datos" });
        if (results.affectedRows === 0) return res.status(404).json({ detail: "No se encontró la categoría" });
        res.json({ message: "Categoría eliminada correctamente" });
    });
});

// Ruta raíz
app.get("/", (req, res) => {
    res.send("🚀 API de Categorías funcionando con tabla products_category");
});

// Iniciar el servidor
app.listen(3001, () => {
    console.log("✅ API corriendo en http://localhost:3001");
});