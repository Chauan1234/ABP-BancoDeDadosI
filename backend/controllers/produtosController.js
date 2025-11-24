const pool = require('../database/connection');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM produto');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByCodigo = async (req, res) => {
  try {
    const { codigo } = req.params;
    const [rows] = await pool.query('SELECT * FROM produto WHERE codigo = ?', [codigo]);
    if (rows.length === 0) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nome, preco, descricao, tamanho, quantidade, codfabricacao } = req.body;
    await pool.query(
      'INSERT INTO produto (nome, preco, descricao, tamanho, quantidade, codfabricacao) VALUES (?, ?, ?, ?, ?, ?)',
      [nome, preco, descricao, tamanho, quantidade, codfabricacao]
    );
    res.status(201).json({ message: 'Produto criado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { codigo } = req.params;
    const { nome, preco, descricao, tamanho, quantidade, codfabricacao } = req.body;

    const [rows] = await pool.query('SELECT * FROM produto WHERE codigo = ?', [codigo]);
    if (rows.length === 0) return res.status(404).json({ error: 'Produto não encontrado' });

    await pool.query(
      'UPDATE produto SET nome = ?, preco = ?, descricao = ?, tamanho = ?, quantidade = ?, codfabricacao = ? WHERE codigo = ?',
      [nome, preco, descricao, tamanho, quantidade, codfabricacao, codigo]
    );
    res.json({ message: 'Produto atualizado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { codigo } = req.params;
    const [rows] = await pool.query('SELECT * FROM produto WHERE codigo = ?', [codigo]);
    if (rows.length === 0) return res.status(404).json({ error: 'Produto não encontrado' });

    await pool.query('DELETE FROM produto WHERE codigo = ?', [codigo]);
    res.json({ message: 'Produto removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
