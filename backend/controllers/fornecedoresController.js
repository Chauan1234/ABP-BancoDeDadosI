const store = require('../database/store');

exports.getAll = async (req, res) => {
  try {
    const rows = await store.getAll('fornecedor');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByCnpj = async (req, res) => {
  try {
    const { cnpj } = req.params;
    const rows = await store.getBy('fornecedor', 'cnpj', cnpj);
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Fornecedor não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { cnpj, nome, endereco, pais, telefone, email } = req.body;
    await store.insert('fornecedor', { cnpj, nome, endereco, pais, telefone, email });
    res.status(201).json({ message: 'Fornecedor criado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { cnpj } = req.params;
    const { nome, endereco, pais, telefone, email } = req.body;

    const existing = await store.getBy('fornecedor', 'cnpj', cnpj);
    if (!existing || existing.length === 0) return res.status(404).json({ error: 'Fornecedor não encontrado' });

    await store.update('fornecedor', 'cnpj', cnpj, { nome, endereco, pais, telefone, email });
    res.json({ message: 'Fornecedor atualizado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { cnpj } = req.params;
    const existing = await store.getBy('fornecedor', 'cnpj', cnpj);
    if (!existing || existing.length === 0) return res.status(404).json({ error: 'Fornecedor não encontrado' });

    // Verifica se existem matérias-primas vinculadas a este fornecedor
    const linkedCount = await store.countBy('materiaPrima', 'codfornecedor', cnpj);
    if (linkedCount > 0) {
      return res.status(400).json({ error: `Não é possível excluir fornecedor: existe(m) ${linkedCount} matéria(s)-prima(s) vinculada(s)` });
    }

    await store.remove('fornecedor', 'cnpj', cnpj);
    res.json({ message: 'Fornecedor removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
