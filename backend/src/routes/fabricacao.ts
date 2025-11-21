import { Router } from "express";
import pool from "../db";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM fabricacao");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.get("/:codigo", async (req, res) => {
  try {
    const [rows]: any = await pool.query("SELECT * FROM fabricacao WHERE codigo = ?", [req.params.codigo]);
    if (rows.length === 0) return res.status(404).json({ message: "Fabricação não encontrada" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.post("/", async (req, res) => {
  try {
    const { nome, dataInicio, dataFinal, descricao, status, codmateriaprima } = req.body;
    const [result]: any = await pool.query(
      "INSERT INTO fabricacao (nome, dataInicio, dataFinal, descricao, status, codmateriaprima) VALUES (?, ?, ?, ?, ?, ?)",
      [nome, dataInicio, dataFinal, descricao, status, codmateriaprima]
    );
    res.status(201).json({ codigo: result.insertId });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.put("/:codigo", async (req, res) => {
  try {
    const { nome, dataInicio, dataFinal, descricao, status, codmateriaprima } = req.body;
    await pool.query(
      "UPDATE fabricacao SET nome=?, dataInicio=?, dataFinal=?, descricao=?, status=?, codmateriaprima=? WHERE codigo=?",
      [nome, dataInicio, dataFinal, descricao, status, codmateriaprima, req.params.codigo]
    );
    res.json({ message: "Fabricação atualizada" });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.delete("/:codigo", async (req, res) => {
  try {
    await pool.query("DELETE FROM fabricacao WHERE codigo = ?", [req.params.codigo]);
    res.json({ message: "Fabricação excluída" });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;
