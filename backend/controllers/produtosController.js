const store = require('../database/store');

exports.getAll = async (req, res) => {
  try {
    const rows = await store.getAll('produto');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByCodigo = async (req, res) => {
  try {
    const { codigo } = req.params;
    const rows = await store.getBy('produto', 'codigo', codigo);
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nome, preco, descricao, tamanho, quantidade, codfabricacao } = req.body;
    await store.insert('produto', { nome, preco, descricao, tamanho, quantidade, codfabricacao });
    res.status(201).json({ message: 'Produto criado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { codigo } = req.params;
    const { nome, preco, descricao, tamanho, quantidade, codfabricacao } = req.body;

    const existing = await store.getBy('produto', 'codigo', codigo);
    if (!existing || existing.length === 0) return res.status(404).json({ error: 'Produto não encontrado' });

    await store.update('produto', 'codigo', codigo, { nome, preco, descricao, tamanho, quantidade, codfabricacao });
    res.json({ message: 'Produto atualizado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { codigo } = req.params;
    const existing = await store.getBy('produto', 'codigo', codigo);
    if (!existing || existing.length === 0) return res.status(404).json({ error: 'Produto não encontrado' });

    await store.remove('produto', 'codigo', codigo);
    res.json({ message: 'Produto removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
