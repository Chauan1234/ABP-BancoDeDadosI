const store = require('../database/store');

exports.getAll = async (req, res) => {
  try {
    const rows = await store.getAll('fabricacao');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByCodigo = async (req, res) => {
  try {
    const { codigo } = req.params;
    const rows = await store.getBy('fabricacao', 'codigo', codigo);
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Fabricação não encontrada' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nome, dataInicio, dataFinal, descricao, status, codmateriaprima } = req.body;
    await store.insert('fabricacao', { nome, dataInicio, dataFinal, descricao, status, codmateriaprima });
    res.status(201).json({ message: 'Fabricação criada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { codigo } = req.params;
    const { nome, dataInicio, dataFinal, descricao, status, codmateriaprima } = req.body;

    const existing = await store.getBy('fabricacao', 'codigo', codigo);
    if (!existing || existing.length === 0) return res.status(404).json({ error: 'Fabricação não encontrada' });

    await store.update('fabricacao', 'codigo', codigo, { nome, dataInicio, dataFinal, descricao, status, codmateriaprima });
    res.json({ message: 'Fabricação atualizada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { codigo } = req.params;
    const existing = await store.getBy('fabricacao', 'codigo', codigo);
    if (!existing || existing.length === 0) return res.status(404).json({ error: 'Fabricação não encontrada' });

    // Verifica se existe algum produto vinculado a esta fabricação
    const linkedCount = await store.countBy('produto', 'codfabricacao', codigo);
    if (linkedCount > 0) {
      return res.status(400).json({ error: `Não é possível excluir fabricação: existe(m) ${linkedCount} produto(s) vinculado(s)` });
    }

    await store.remove('fabricacao', 'codigo', codigo);
    res.json({ message: 'Fabricação removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
