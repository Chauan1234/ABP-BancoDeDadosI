import { Router } from "express";
import pool from "../db";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM fornecedor");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.get("/:cnpj", async (req, res) => {
  try {
    const [rows]: any = await pool.query("SELECT * FROM fornecedor WHERE cnpj = ?", [req.params.cnpj]);
    if (rows.length === 0) return res.status(404).json({ message: "Fornecedor não encontrado" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.post("/", async (req, res) => {
  try {
    const { cnpj, nome, endereco, pais, telefone, email } = req.body;
    await pool.query(
      "INSERT INTO fornecedor (cnpj, nome, endereco, pais, telefone, email) VALUES (?, ?, ?, ?, ?, ?)",
      [cnpj, nome, endereco, pais, telefone, email]
    );
    res.status(201).json({ message: "Fornecedor criado" });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.put("/:cnpj", async (req, res) => {
  try {
    const { nome, endereco, pais, telefone, email } = req.body;
    await pool.query(
      "UPDATE fornecedor SET nome=?, endereco=?, pais=?, telefone=?, email=? WHERE cnpj=?",
      [nome, endereco, pais, telefone, email, req.params.cnpj]
    );
    res.json({ message: "Fornecedor atualizado" });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.delete("/:cnpj", async (req, res) => {
  try {
    await pool.query("DELETE FROM fornecedor WHERE cnpj = ?", [req.params.cnpj]);
    res.json({ message: "Fornecedor excluído" });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;
