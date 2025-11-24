"use client";
import React, { useEffect, useState } from "react";
import { getErrorMessage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusIcon, TrashIcon, PencilIcon } from "lucide-react";
import Link from "next/link";
import DeletarProdutoModal from "./_components/modal-deletar-produto";

type Produto = {
    codigo: number;
    nome: string;
    preco: number;
    descricao?: string;
    tamanho?: number;
    quantidade?: number;
    codfabricacao?: number;
};

export default function ProdutosPage() {
    const [items, setItems] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fabricacoesMap, setFabricacoesMap] = useState<Record<string, string>>({});

    async function load() {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
        try {
            setLoading(true);
            setError(null);
            const [resProd, resFab] = await Promise.all([fetch(`${baseUrl}/produtos`), fetch(`${baseUrl}/fabricacoes`)]);
            if (!resProd.ok) throw new Error(`Erro produtos ${resProd.status}`);
            const data = await resProd.json();
            setItems(data);

                if (resFab.ok) {
                    const fabs = await resFab.json();
                    const map: Record<string, string> = {};
                    (fabs || []).forEach((f: { codigo?: number | string; nome?: string | null }) => { map[String(f.codigo)] = f.nome ?? String(f.codigo); });
                    setFabricacoesMap(map);
                } else {
                setFabricacoesMap({});
            }
        } catch (err: unknown) {
            setError(getErrorMessage(err) ?? "Erro ao carregar produtos");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { let mounted = true; if (mounted) load(); return () => { mounted = false; }; }, []);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCodigo, setSelectedCodigo] = useState<number | null>(null);

    return (
        <div className="space-y-4">
            <div className="flex items-start">
                <div>
                    <h2 className="text-2xl font-semibold">Produtos</h2>
                    <p className="text-sm text-muted-foreground mt-1">Gerencie os produtos.</p>
                </div>
            </div>

            <div className="flex justify-end mb-6">
                <Link href="/produtos/novo">
                    <Button variant="outline" className="flex items-left gap-2">
                        <PlusIcon className="size-4" />
                        <span>Adicionar</span>
                    </Button>
                </Link>
            </div>

            <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
                <div className="max-h-[530px] relative overflow-auto">
                    <Table>
                        <TableHeader className="bg-muted sticky top-0">
                            <TableRow>
                                <TableHead>Código</TableHead>
                                <TableHead>Nome</TableHead>
                                <TableHead>Preço</TableHead>
                                <TableHead>Tamanho</TableHead>
                                <TableHead>Quantidade</TableHead>
                                <TableHead>Fabricação</TableHead>
                                <TableHead>Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading && (<TableRow><td colSpan={7} className="p-4">Carregando...</td></TableRow>)}
                            {error && !loading && (<TableRow><td colSpan={7} className="p-4 text-red-600">Erro: {error}</td></TableRow>)}
                            {!loading && !error && items.length === 0 && (<TableRow><td colSpan={7} className="p-4">Nenhum item encontrado.</td></TableRow>)}
                            {!loading && !error && items.map(i => (
                                <TableRow key={i.codigo}>
                                    <TableCell className="px-4 py-2">{i.codigo}</TableCell>
                                    <TableCell className="px-4 py-2">{i.nome}</TableCell>
                                    <TableCell className="px-4 py-2">{i.preco?.toFixed?.(2) ?? i.preco}</TableCell>
                                    <TableCell className="px-4 py-2">{i.tamanho ?? '-'}</TableCell>
                                    <TableCell className="px-4 py-2">{i.quantidade ?? '-'}</TableCell>
                                    <TableCell className="px-4 py-2">{i.codfabricacao ? (fabricacoesMap[String(i.codfabricacao)] ?? i.codfabricacao) : '-'}</TableCell>
                                    <td className="px-4 py-2 flex gap-2">
                                        <Link href={`/produtos/${i.codigo}/atualizar`}>
                                            <Button variant="ghost" size="icon"><PencilIcon /></Button>
                                        </Link>
                                        <Button variant="destructive" size="icon" onClick={() => { setSelectedCodigo(i.codigo); setModalOpen(true); }}><TrashIcon /></Button>
                                    </td>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <DeletarProdutoModal open={modalOpen} onOpenChange={(v:boolean)=>setModalOpen(v)} codigo={selectedCodigo} onDeleted={() => { setModalOpen(false); setSelectedCodigo(null); load(); }} />
        </div>
    );
}