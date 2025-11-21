import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import fornecedorRouter from "./routes/fornecedor";
import materiaPrimaRouter from "./routes/materiaPrima";
import fabricacaoRouter from "./routes/fabricacao";
import produtoRouter from "./routes/produto";
import mpfRouter from "./routes/materiaPrimaFabricacao";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/fornecedores", fornecedorRouter);
app.use("/api/materias", materiaPrimaRouter);
app.use("/api/fabricacoes", fabricacaoRouter);
app.use("/api/produtos", produtoRouter);
app.use("/api/mpf", mpfRouter);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`Backend rodando em http://localhost:${port}`);
});
