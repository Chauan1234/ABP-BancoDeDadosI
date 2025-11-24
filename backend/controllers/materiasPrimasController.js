const pool = require('../database/connection');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM materiaPrima');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByCodigo = async (req, res) => {
  try {
    const { codigo } = req.params;
    const [rows] = await pool.query('SELECT * FROM materiaPrima WHERE codigo = ?', [codigo]);
    if (rows.length === 0) return res.status(404).json({ error: 'Matéria-prima não encontrada' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nome, preco, quantidade, codfornecedor } = req.body;
    await pool.query(
      'INSERT INTO materiaPrima (nome, preco, quantidade, codfornecedor) VALUES (?, ?, ?, ?)',
      [nome, preco, quantidade, codfornecedor]
    );
    res.status(201).json({ message: 'Matéria-prima criada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { codigo } = req.params;
    const { nome, preco, quantidade, codfornecedor } = req.body;

    const [rows] = await pool.query('SELECT * FROM materiaPrima WHERE codigo = ?', [codigo]);
    if (rows.length === 0) return res.status(404).json({ error: 'Matéria-prima não encontrada' });

    await pool.query(
      'UPDATE materiaPrima SET nome = ?, preco = ?, quantidade = ?, codfornecedor = ? WHERE codigo = ?',
      [nome, preco, quantidade, codfornecedor, codigo]
    );
    res.json({ message: 'Matéria-prima atualizada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { codigo } = req.params;
    const [rows] = await pool.query('SELECT * FROM materiaPrima WHERE codigo = ?', [codigo]);
    if (rows.length === 0) return res.status(404).json({ error: 'Matéria-prima não encontrada' });

    // Verifica se existe alguma fabricação vinculada a esta matéria-prima
    const [countRows] = await pool.query('SELECT COUNT(*) AS cnt FROM fabricacao WHERE codmateriaprima = ?', [codigo]);
    const linkedCount = countRows && countRows[0] ? countRows[0].cnt : 0;
    if (linkedCount > 0) {
      return res.status(400).json({ error: `Não é possível excluir matéria-prima: existe(m) ${linkedCount} fabricação(ões) vinculada(s)` });
    }

    await pool.query('DELETE FROM materiaPrima WHERE codigo = ?', [codigo]);
    res.json({ message: 'Matéria-prima removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
