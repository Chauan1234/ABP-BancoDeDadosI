"use client";

import React, { useEffect, useState } from "react";
import { getErrorMessage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import DeletarFornecedorModal from "./_components/modal-deletar-fornecedor";

type Fornecedor = {
    id: number | string;
    nome: string;
    cnpj?: string;
    pais?: string;
    endereco?: string;
    telefone?: string;
    email?: string;
};

export default function FornecedoresPage() {
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCnpj, setSelectedCnpj] = useState<string | null>(null);

    async function loadFornecedores() {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
        const url = `${baseUrl}/fornecedores`;
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Erro ${res.status}`);
            const data = await res.json();
            setFornecedores(data);
        } catch (err: unknown) {
            setError(getErrorMessage(err) ?? "Erro ao carregar fornecedores");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let mounted = true;
        if (mounted) loadFornecedores();
        return () => { mounted = false; };
    }, []);

    return (
        <div className="space-y-4">
            <div className="flex items-start">
                <div>
                    <h2 className="text-2xl font-semibold">Fornecedores</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Gerencie os fornecedores da sua empresa.
                    </p>
                </div>
            </div>

            <div className="flex justify-end mb-6">
                <Link href="/fornecedores/novo-fornecedor">
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
                                <TableHead>
                                    Nome
                                </TableHead>
                                <TableHead>
                                    CNPJ
                                </TableHead>
                                <TableHead>
                                    País
                                </TableHead>
                                <TableHead>
                                    Endereço
                                </TableHead>
                                <TableHead>
                                    Telefone
                                </TableHead>
                                <TableHead>
                                    Email
                                </TableHead>
                                <TableHead>
                                    Ações
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading && (
                                <TableRow>
                                    <td colSpan={6} className="p-4">Carregando...</td>
                                </TableRow>
                            )}
                            {error && !loading && (
                                <TableRow>
                                    <td colSpan={6} className="p-4 text-red-600">Erro: {error}</td>
                                </TableRow>
                            )}
                            {!loading && !error && fornecedores.length === 0 && (
                                <TableRow>
                                    <td colSpan={6} className="p-4">Nenhum fornecedor encontrado.</td>
                                </TableRow>
                            )}
                            {!loading && !error && fornecedores.map((f) => (
                                <TableRow key={f.id}>
                                    <TableCell className="px-4 py-2">{f.nome}</TableCell>
                                    <TableCell className="px-4 py-2">{f.cnpj ?? "-"}</TableCell>
                                    <TableCell className="px-4 py-2">{f.pais ?? "-"}</TableCell>
                                    <TableCell className="px-4 py-2">{f.endereco ?? "-"}</TableCell>
                                    <TableCell className="px-4 py-2">{f.telefone ?? "-"}</TableCell>
                                    <TableCell className="px-4 py-2">{f.email ?? "-"}</TableCell>
                                    <td className="px-4 py-2 flex gap-2">
                                        <Link href={`/fornecedores/${f.cnpj}/atualizar-fornecedor`}>
                                            <Button variant="ghost" size="icon" aria-label="Editar fornecedor">
                                                <PencilIcon />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            aria-label="Excluir fornecedor"
                                            onClick={() => {
                                                setSelectedCnpj(String(f.cnpj));
                                                setModalOpen(true);
                                            }}
                                        >
                                            <TrashIcon />
                                        </Button>
                                    </td>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <DeletarFornecedorModal
                open={modalOpen}
                onOpenChange={(v: boolean) => setModalOpen(v)}
                {...(selectedCnpj ? { cnpj: selectedCnpj } : {})}
                onDeleted={() => {
                    setModalOpen(false);
                    setSelectedCnpj(null);
                    loadFornecedores();
                }}
            />
        </div>
    )
}