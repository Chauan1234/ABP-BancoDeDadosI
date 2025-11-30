const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data.json');

// Simple write lock to serialize writes
let writeLock = Promise.resolve();

async function readData() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return { fornecedor: [], materiaPrima: [], fabricacao: [], produto: [], materiaprimafabricacao: [] };
    }
    throw err;
  }
}

async function writeData(data) {
  // serialize writes
  writeLock = writeLock.then(() => fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8'));
  return writeLock;
}

function ensureTable(data, table) {
  if (!data[table]) data[table] = [];
}

function getNextCodigo(items) {
  let max = 0;
  for (const it of items) {
    const c = Number(it.codigo);
    if (!Number.isNaN(c) && c > max) max = c;
  }
  return max + 1;
}

async function getAll(table) {
  const data = await readData();
  ensureTable(data, table);
  return data[table];
}

async function getBy(table, key, value) {
  const data = await readData();
  ensureTable(data, table);
  return data[table].filter((item) => String(item[key]) === String(value));
}

async function getOne(table, key, value) {
  const list = await getBy(table, key, value);
  return list.length > 0 ? list[0] : null;
}

async function insert(table, obj) {
  const data = await readData();
  ensureTable(data, table);
  const list = data[table];
  // if table uses numeric 'codigo' and none provided, generate
  if (obj.codigo === undefined || obj.codigo === null) {
    obj.codigo = getNextCodigo(list);
  }
  list.push(obj);
  data[table] = list;
  await writeData(data);
  return obj;
}

async function update(table, key, value, updates) {
  const data = await readData();
  ensureTable(data, table);
  const list = data[table];
  const idx = list.findIndex((it) => String(it[key]) === String(value));
  if (idx === -1) return null;
  list[idx] = Object.assign({}, list[idx], updates);
  data[table] = list;
  await writeData(data);
  return list[idx];
}

async function remove(table, key, value) {
  const data = await readData();
  ensureTable(data, table);
  const list = data[table];
  const filtered = list.filter((it) => String(it[key]) !== String(value));
  const removed = list.length - filtered.length;
  data[table] = filtered;
  await writeData(data);
  return removed;
}

async function countBy(table, key, value) {
  const list = await getBy(table, key, value);
  return list.length;
}

module.exports = {
  getAll,
  getBy,
  getOne,
  insert,
  update,
  remove,
  countBy,
};
