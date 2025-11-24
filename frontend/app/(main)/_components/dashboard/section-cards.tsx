"use client";

import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function SectionCards() {
    const [fornecedores, setFornecedores] = useState<number | null>(null);
    const [materias, setMaterias] = useState<number | null>(null);
    const [fabricacoes, setFabricacoes] = useState<number | null>(null);
    const [produtos, setProdutos] = useState<number | null>(null);
    const [valorEstoque, setValorEstoque] = useState<number | null>(null);

    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
                const [resFor, resMat, resFab, resProd] = await Promise.all([
                    fetch(`${baseUrl}/fornecedores`),
                    fetch(`${baseUrl}/materias-primas`),
                    fetch(`${baseUrl}/fabricacoes`),
                    fetch(`${baseUrl}/produtos`),
                ]);

                if (!mounted) return;

                if (resFor.ok) {
                    const data = await resFor.json();
                    setFornecedores((data || []).length);
                }
                if (resMat.ok) {
                    const data = await resMat.json();
                    setMaterias((data || []).length);
                }
                if (resFab.ok) {
                    const data = await resFab.json();
                    setFabricacoes((data || []).length);
                }
                if (resProd.ok) {
                    const data = await resProd.json();
                    setProdutos((data || []).length);
                    const total = (data || []).reduce((acc: number, p: { preco?: number | string; quantidade?: number | string }) => {
                        const preco = Number(p.preco || 0);
                        const quantidade = Number(p.quantidade || 0);
                        return acc + preco * quantidade;
                    }, 0);
                    setValorEstoque(total);
                }
            } catch {
                console.log("Erro ao carregar dados do dashboard");
            }
        }
        load();
        return () => { mounted = false; };
    }, []);

    return (
        <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4">
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Fornecedores</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{fornecedores ?? '—'}</CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Total de fornecedores cadastrados <TrendingUpIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground">Dados em tempo real</div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Matérias-primas</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{materias ?? '—'}</CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Itens de inventário <TrendingDownIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground">Atualize fornecedores para manter estoque correto</div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Fabricações</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{fabricacoes ?? '—'}</CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Produções registradas <TrendingUpIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground">Acompanhe o progresso das fabricações</div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Produtos / Valor estoque</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{produtos ?? '—'} <span className="text-sm text-muted-foreground block">{valorEstoque != null ? `R$ ${valorEstoque.toFixed(2)}` : '—'}</span></CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Produtos disponíveis no estoque
                    </div>
                    <div className="text-muted-foreground">Valor estimado de estoque</div>
                </CardFooter>
            </Card>
        </div>
    );
}