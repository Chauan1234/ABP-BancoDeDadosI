import { Router } from "express";
import pool from "../db";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM produto");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.get("/:codigo", async (req, res) => {
  try {
    const [rows]: any = await pool.query("SELECT * FROM produto WHERE codigo = ?", [req.params.codigo]);
    if (rows.length === 0) return res.status(404).json({ message: "Produto não encontrado" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.post("/", async (req, res) => {
  try {
    const { nome, preco, descricao, tamanho, quantidade, codfabricacao } = req.body;
    const [result]: any = await pool.query(
      "INSERT INTO produto (nome, preco, descricao, tamanho, quantidade, codfabricacao) VALUES (?, ?, ?, ?, ?, ?)",
      [nome, preco, descricao, tamanho, quantidade, codfabricacao]
    );
    res.status(201).json({ codigo: result.insertId });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.put("/:codigo", async (req, res) => {
  try {
    const { nome, preco, descricao, tamanho, quantidade, codfabricacao } = req.body;
    await pool.query(
      "UPDATE produto SET nome=?, preco=?, descricao=?, tamanho=?, quantidade=?, codfabricacao=? WHERE codigo=?",
      [nome, preco, descricao, tamanho, quantidade, codfabricacao, req.params.codigo]
    );
    res.json({ message: "Produto atualizado" });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.delete("/:codigo", async (req, res) => {
  try {
    await pool.query("DELETE FROM produto WHERE codigo = ?", [req.params.codigo]);
    res.json({ message: "Produto excluído" });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;
