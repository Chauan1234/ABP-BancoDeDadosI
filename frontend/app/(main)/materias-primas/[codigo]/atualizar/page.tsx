"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export default function AtualizarMateriaPrimaPage() {
    const params = useParams();
    const codigo = params?.codigo;
    const router = useRouter();

    const [form, setForm] = useState({ nome: "", preco: "", quantidade: "", codfornecedor: "none" });
    const [loading, setLoading] = useState(false);
    const [, setLoadingData] = useState(true);
    const [fornecedores, setFornecedores] = useState<Array<{ cnpj?: number | string; nome?: string }>>([]);

    useEffect(() => {
        let mounted = true;
        async function loadAll() {
            if (!codigo) return; setLoadingData(true);
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
                const [resFor, resMat] = await Promise.all([fetch(`${baseUrl}/fornecedores`), fetch(`${baseUrl}/materias-primas/${codigo}`)]);
                const fdata = resFor.ok ? await resFor.json() : [];
                const mdata = resMat.ok ? await resMat.json() : null;
                if (mounted) {
                    setFornecedores(fdata || []);
                    setForm({ nome: mdata?.nome ?? '', preco: mdata?.preco ? String(mdata.preco) : '', quantidade: mdata?.quantidade ? String(mdata.quantidade) : '', codfornecedor: mdata?.codfornecedor ? String(mdata.codfornecedor) : 'none' });
                }
            } catch (err: unknown) { if (mounted) toast.error(getErrorMessage(err) ?? 'Erro ao carregar', { closeButton: true }); }
            finally { if (mounted) setLoadingData(false); }
        }
        loadAll(); return () => { mounted = false; };
    }, [codigo]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) { const target = e.target as HTMLInputElement; const { name, value } = target; setForm(s => ({ ...s, [name]: value })); }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); if (!codigo) return toast.error('Código inválido', { closeButton: true }); setLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
            const res = await fetch(`${baseUrl}/materias-primas/${codigo}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nome: form.nome, preco: Number(form.preco || 0), quantidade: Number(form.quantidade || 0), codfornecedor: form.codfornecedor && form.codfornecedor !== 'none' ? form.codfornecedor : null }) });
            if (!res.ok) { const json = await res.json().catch(() => null); throw new Error(json?.error ?? `Status ${res.status}`); }
            toast.success('Matéria-prima atualizada com sucesso', { closeButton: true }); router.push('/materias-primas');
        } catch (err: unknown) { toast.error(getErrorMessage(err) ?? 'Erro ao atualizar', { closeButton: true }); } finally { setLoading(false); }
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Voltar">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold">Atualizar Matéria-prima</h1>
                    <p className="text-sm text-muted-foreground">Atualize os dados da matéria-prima no seu sistema</p>
                </div>
            </div>

            <div className="bg-card border rounded-lg shadow-sm">
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1">
                            <Label htmlFor="nome">Nome</Label>
                            <Input id="nome" name="nome" placeholder="Digite o nome" value={form.nome} onChange={handleChange} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="preco">Preço</Label>
                                <Input id="preco" name="preco" placeholder="Digite o preço" value={form.preco} onChange={handleChange} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="quantidade">Quantidade</Label>
                                <Input id="quantidade" name="quantidade" placeholder="Digite a quantidade" value={form.quantidade} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="codfornecedor">Fornecedor</Label>
                            <Select value={form.codfornecedor} onValueChange={(v) => setForm(s => ({ ...s, codfornecedor: v }))}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione um fornecedor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {fornecedores.map((f: { cnpj?: number | string; nome?: string | null }) => (
                                        <SelectItem key={String(f.cnpj)} value={String(f.cnpj)}>
                                            {`${f.nome} (${f.cnpj})`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <Button type="button" variant="ghost" onClick={() => router.back()}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Salvando...' : 'Atualizar Matéria-prima'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
