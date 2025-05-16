const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Configura tu conexión a MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234", 
    database: "ecommerce"
});

// Obtener todas las categorías
app.get("/categories", (req, res) => {
    db.query("SELECT * FROM categories", (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Obtener una categoría por ID
app.get("/categories/:id", (req, res) => {
    db.query("SELECT * FROM categories WHERE id = ?", [req.params.id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).json({ message: "Categoría no encontrada" });
        res.json(results[0]);
    });
});

// Crear una nueva categoría
app.post("/categories", (req, res) => {
    const { name } = req.body;
    db.query("INSERT INTO categories (name) VALUES (?)", [name], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ id: results.insertId, name });
    });
});

// Actualizar una categoría
app.put("/categories/:id", (req, res) => {
    const { name } = req.body;
    db.query("UPDATE categories SET name = ? WHERE id = ?", [name, req.params.id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.affectedRows === 0) return res.status(404).send({ message: "No se encontró la categoría" });
        res.json({ id: req.params.id, name });
    });
});

// Eliminar una categoría
app.delete("/categories/:id", (req, res) => {
    db.query("DELETE FROM categories WHERE id = ?", [req.params.id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.affectedRows === 0) return res.status(404).send({ message: "No se encontró la categoría" });
        res.json({ message: "Categoría eliminada correctamente" });
    });
});

// Iniciar el servidor
app.listen(3001, () => {
    console.log("API de Categorías corriendo en http://localhost:3001");
});

// Ruta raíz para confirmar que el servidor está activo
app.get("/", (req, res) => {
    res.send("🚀 API de Categorías funcionando en Express");
});


app.get("/products/category/:categoryId", (req, res) => {
    const categoryId = req.params.categoryId;
    db.query("SELECT * FROM products WHERE category_id = ?", [categoryId], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send({ message: "Sin productos en esta categoría" });
        res.json(results);
    });
});