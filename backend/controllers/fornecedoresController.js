const pool = require('../database/connection');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM fornecedor');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByCnpj = async (req, res) => {
  try {
    const { cnpj } = req.params;
    const [rows] = await pool.query('SELECT * FROM fornecedor WHERE cnpj = ?', [cnpj]);
    if (rows.length === 0) return res.status(404).json({ error: 'Fornecedor não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { cnpj, nome, endereco, pais, telefone, email } = req.body;
    await pool.query(
      'INSERT INTO fornecedor (cnpj, nome, endereco, pais, telefone, email) VALUES (?, ?, ?, ?, ?, ?)',
      [cnpj, nome, endereco, pais, telefone, email]
    );
    res.status(201).json({ message: 'Fornecedor criado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { cnpj } = req.params;
    const { nome, endereco, pais, telefone, email } = req.body;

    const [rows] = await pool.query('SELECT * FROM fornecedor WHERE cnpj = ?', [cnpj]);
    if (rows.length === 0) return res.status(404).json({ error: 'Fornecedor não encontrado' });

    await pool.query(
      'UPDATE fornecedor SET nome = ?, endereco = ?, pais = ?, telefone = ?, email = ? WHERE cnpj = ?',
      [nome, endereco, pais, telefone, email, cnpj]
    );
    res.json({ message: 'Fornecedor atualizado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { cnpj } = req.params;
    const [rows] = await pool.query('SELECT * FROM fornecedor WHERE cnpj = ?', [cnpj]);
    if (rows.length === 0) return res.status(404).json({ error: 'Fornecedor não encontrado' });

    // Verifica se existem matérias-primas vinculadas a este fornecedor
    const [countRows] = await pool.query('SELECT COUNT(*) AS cnt FROM materiaPrima WHERE codfornecedor = ?', [cnpj]);
    const linkedCount = countRows && countRows[0] ? countRows[0].cnt : 0;
    if (linkedCount > 0) {
      return res.status(400).json({ error: `Não é possível excluir fornecedor: existe(m) ${linkedCount} matéria(s)-prima(s) vinculada(s)` });
    }

    await pool.query('DELETE FROM fornecedor WHERE cnpj = ?', [cnpj]);
    res.json({ message: 'Fornecedor removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
