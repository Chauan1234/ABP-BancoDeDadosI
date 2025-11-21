import { Router } from "express";
import pool from "../db";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM materiaPrimaFabricacao");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.post("/", async (req, res) => {
  try {
    const { codmateriaprima, codfabricacao } = req.body;
    await pool.query("INSERT INTO materiaPrimaFabricacao (codmateriaprima, codfabricacao) VALUES (?, ?)", [
      codmateriaprima,
      codfabricacao,
    ]);
    res.status(201).json({ message: "Relação criada" });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.delete("/", async (req, res) => {
  try {
    const { codmateriaprima, codfabricacao } = req.body;
    await pool.query("DELETE FROM materiaPrimaFabricacao WHERE codmateriaprima = ? AND codfabricacao = ?", [
      codmateriaprima,
      codfabricacao,
    ]);
    res.json({ message: "Relação excluída" });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;
