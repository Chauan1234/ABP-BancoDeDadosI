const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

const fornecedoresRouter = require('./routes/fornecedores');
const materiasRouter = require('./routes/materias-primas');
const fabricacoesRouter = require('./routes/fabricacoes');
const produtosRouter = require('./routes/produtos');
const cors = require("cors");

app.use(express.json());

app.use(cors({ origin: "http://localhost:3000" }));

app.use('/fornecedores', fornecedoresRouter);
app.use('/materias-primas', materiasRouter);
app.use('/fabricacoes', fabricacoesRouter);
app.use('/produtos', produtosRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Erro interno' });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
