import { Router } from "express";
import pool from "../db";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM materiaPrima");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.get("/:codigo", async (req, res) => {
  try {
    const [rows]: any = await pool.query("SELECT * FROM materiaPrima WHERE codigo = ?", [req.params.codigo]);
    if (rows.length === 0) return res.status(404).json({ message: "Materia-prima não encontrada" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.post("/", async (req, res) => {
  try {
    const { nome, preco, quantidade, codfornecedor } = req.body;
    const [result]: any = await pool.query(
      "INSERT INTO materiaPrima (nome, preco, quantidade, codfornecedor) VALUES (?, ?, ?, ?)",
      [nome, preco, quantidade, codfornecedor]
    );
    res.status(201).json({ codigo: result.insertId });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.put("/:codigo", async (req, res) => {
  try {
    const { nome, preco, quantidade, codfornecedor } = req.body;
    await pool.query(
      "UPDATE materiaPrima SET nome=?, preco=?, quantidade=?, codfornecedor=? WHERE codigo=?",
      [nome, preco, quantidade, codfornecedor, req.params.codigo]
    );
    res.json({ message: "Materia-prima atualizada" });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.delete("/:codigo", async (req, res) => {
  try {
    await pool.query("DELETE FROM materiaPrima WHERE codigo = ?", [req.params.codigo]);
    res.json({ message: "Materia-prima excluída" });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;
