"use client";
import React, { useEffect, useState } from "react";
import { getErrorMessage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusIcon, TrashIcon, PencilIcon } from "lucide-react";
import DeletarFabricacaoModal from "./_components/modal-deletar-fabricacao";
import Link from "next/link";

type Fabricacao = {
    codigo: number;
    nome: string;
    dataInicio?: string;
    dataFinal?: string;
    descricao?: string;
    status?: string;
    codmateriaprima?: number;
};

export default function FabricacaoPage() {
    const [items, setItems] = useState<Fabricacao[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [materiasMap, setMateriasMap] = useState<Record<string, string>>({});

    async function load() {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
        try {
            setLoading(true);
            setError(null);
            const [resFab, resMat] = await Promise.all([fetch(`${baseUrl}/fabricacoes`), fetch(`${baseUrl}/materias-primas`)]);
            if (!resFab.ok) throw new Error(`Erro fabricacoes ${resFab.status}`);
            const data = await resFab.json();
            setItems(data);

                if (resMat.ok) {
                    const mats = await resMat.json();
                    const map: Record<string, string> = {};
                    (mats || []).forEach((m: { codigo?: number | string; nome?: string | null }) => { map[String(m.codigo)] = m.nome ?? String(m.codigo); });
                    setMateriasMap(map);
                } else {
                setMateriasMap({});
            }
        } catch (err: unknown) {
            setError(getErrorMessage(err) ?? "Erro ao carregar fabricações");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let mounted = true;
        if (mounted) load();
        return () => { mounted = false; };
    }, []);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCodigo, setSelectedCodigo] = useState<number | null>(null);

    function formatDate(value?: string | null) {
        if (!value) return '-';
        try {
            const d = new Date(value);
            return d.toLocaleDateString('pt-BR');
        } catch {
            return '-';
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-start">
                <div>
                    <h2 className="text-2xl font-semibold">Fabricações</h2>
                    <p className="text-sm text-muted-foreground mt-1">Gerencie as fabricações.</p>
                </div>
            </div>

            <div className="flex justify-end mb-6">
                <Link href="/fabricacoes/novo">
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
                                <TableHead>Codigo</TableHead>
                                <TableHead>Nome</TableHead>
                                <TableHead>Início</TableHead>
                                <TableHead>Fim</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Matéria-prima</TableHead>
                                <TableHead>Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading && (
                                <TableRow><td colSpan={7} className="p-4">Carregando...</td></TableRow>
                            )}
                            {error && !loading && (
                                <TableRow><td colSpan={7} className="p-4 text-red-600">Erro: {error}</td></TableRow>
                            )}
                            {!loading && !error && items.length === 0 && (
                                <TableRow><td colSpan={7} className="p-4">Nenhum item encontrado.</td></TableRow>
                            )}
                            {!loading && !error && items.map(i => (
                                <TableRow key={i.codigo}>
                                    <TableCell className="px-4 py-2">{i.codigo}</TableCell>
                                    <TableCell className="px-4 py-2">{i.nome}</TableCell>
                                    <TableCell className="px-4 py-2">{formatDate(i.dataInicio)}</TableCell>
                                    <TableCell className="px-4 py-2">{formatDate(i.dataFinal)}</TableCell>
                                    <TableCell className="px-4 py-2">{i.status ?? '-'}</TableCell>
                                    <TableCell className="px-4 py-2">{i.codmateriaprima ? (materiasMap[String(i.codmateriaprima)] ?? i.codmateriaprima) : '-'}</TableCell>
                                    <td className="px-4 py-2 flex gap-2">
                                        <Link href={`/fabricacoes/${i.codigo}/atualizar`}>
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
            <DeletarFabricacaoModal open={modalOpen} onOpenChange={(v:boolean) => setModalOpen(v)} codigo={selectedCodigo} onDeleted={() => { setModalOpen(false); setSelectedCodigo(null); load(); }} />
        </div>
    );
}