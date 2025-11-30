const store = require('../database/store');

exports.getAll = async (req, res) => {
  try {
    const rows = await store.getAll('materiaPrima');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByCodigo = async (req, res) => {
  try {
    const { codigo } = req.params;
    const rows = await store.getBy('materiaPrima', 'codigo', codigo);
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Matéria-prima não encontrada' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nome, preco, quantidade, codfornecedor } = req.body;
    await store.insert('materiaPrima', { nome, preco, quantidade, codfornecedor });
    res.status(201).json({ message: 'Matéria-prima criada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { codigo } = req.params;
    const { nome, preco, quantidade, codfornecedor } = req.body;

    const existing = await store.getBy('materiaPrima', 'codigo', codigo);
    if (!existing || existing.length === 0) return res.status(404).json({ error: 'Matéria-prima não encontrada' });

    await store.update('materiaPrima', 'codigo', codigo, { nome, preco, quantidade, codfornecedor });
    res.json({ message: 'Matéria-prima atualizada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { codigo } = req.params;
    const existing = await store.getBy('materiaPrima', 'codigo', codigo);
    if (!existing || existing.length === 0) return res.status(404).json({ error: 'Matéria-prima não encontrada' });

    // Verifica se existe alguma fabricação vinculada a esta matéria-prima
    const linkedCount = await store.countBy('fabricacao', 'codmateriaprima', codigo);
    if (linkedCount > 0) {
      return res.status(400).json({ error: `Não é possível excluir matéria-prima: existe(m) ${linkedCount} fabricação(ões) vinculada(s)` });
    }

    await store.remove('materiaPrima', 'codigo', codigo);
    res.json({ message: 'Matéria-prima removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
