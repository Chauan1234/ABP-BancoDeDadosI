const pool = require('../database/connection');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM fabricacao');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByCodigo = async (req, res) => {
  try {
    const { codigo } = req.params;
    const [rows] = await pool.query('SELECT * FROM fabricacao WHERE codigo = ?', [codigo]);
    if (rows.length === 0) return res.status(404).json({ error: 'Fabricação não encontrada' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nome, dataInicio, dataFinal, descricao, status, codmateriaprima } = req.body;
    await pool.query(
      'INSERT INTO fabricacao (nome, dataInicio, dataFinal, descricao, status, codmateriaprima) VALUES (?, ?, ?, ?, ?, ?)',
      [nome, dataInicio, dataFinal, descricao, status, codmateriaprima]
    );
    res.status(201).json({ message: 'Fabricação criada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { codigo } = req.params;
    const { nome, dataInicio, dataFinal, descricao, status, codmateriaprima } = req.body;

    const [rows] = await pool.query('SELECT * FROM fabricacao WHERE codigo = ?', [codigo]);
    if (rows.length === 0) return res.status(404).json({ error: 'Fabricação não encontrada' });

    await pool.query(
      'UPDATE fabricacao SET nome = ?, dataInicio = ?, dataFinal = ?, descricao = ?, status = ?, codmateriaprima = ? WHERE codigo = ?',
      [nome, dataInicio, dataFinal, descricao, status, codmateriaprima, codigo]
    );
    res.json({ message: 'Fabricação atualizada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { codigo } = req.params;
    const [rows] = await pool.query('SELECT * FROM fabricacao WHERE codigo = ?', [codigo]);
    if (rows.length === 0) return res.status(404).json({ error: 'Fabricação não encontrada' });

    // Verifica se existe algum produto vinculado a esta fabricação
    const [countRows] = await pool.query('SELECT COUNT(*) AS cnt FROM produto WHERE codfabricacao = ?', [codigo]);
    const linkedCount = countRows && countRows[0] ? countRows[0].cnt : 0;
    if (linkedCount > 0) {
      return res.status(400).json({ error: `Não é possível excluir fabricação: existe(m) ${linkedCount} produto(s) vinculado(s)` });
    }

    await pool.query('DELETE FROM fabricacao WHERE codigo = ?', [codigo]);
    res.json({ message: 'Fabricação removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
