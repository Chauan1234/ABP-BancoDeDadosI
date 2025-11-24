"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AtualizarFabricacaoPage() {
    const params = useParams();
    const codigo = params?.codigo;
    const router = useRouter();

    const [form, setForm] = useState({ nome: "", dataInicio: "", dataFinal: "", descricao: "", status: "I", codmateriaprima: "" });
    const [loading, setLoading] = useState(false);
    const [, setLoadingData] = useState(true);
    const [materias, setMaterias] = useState<Array<{ codigo?: number | string; nome?: string }>>([]);

    useEffect(() => {
        let mounted = true;
        async function loadAll() {
            if (!codigo) return;
            setLoadingData(true);
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
                const [resMat, resFab] = await Promise.all([fetch(`${baseUrl}/materias-primas`), fetch(`${baseUrl}/fabricacoes/${codigo}`)]);
                const mats = resMat.ok ? await resMat.json() : [];
                const fab = resFab.ok ? await resFab.json() : null;
                if (mounted) {
                    setMaterias(mats || []);
                    setForm({ nome: fab?.nome ?? "", dataInicio: fab?.dataInicio ?? "", dataFinal: fab?.dataFinal ?? "", descricao: fab?.descricao ?? "", status: fab?.status ?? "I", codmateriaprima: fab?.codmateriaprima ? String(fab.codmateriaprima) : 'none' });
                }
            } catch (err: unknown) {
                toast.error(getErrorMessage(err) ?? "Erro ao carregar fabricação", { closeButton: true });
            } finally { if (mounted) setLoadingData(false); }
        }
        loadAll();
        return () => { mounted = false; };
    }, [codigo]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        const { name, value } = target;
        setForm((s) => ({ ...s, [name]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!codigo) return toast.error("Código inválido", { closeButton: true });
        setLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
            const res = await fetch(`${baseUrl}/fabricacoes/${codigo}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nome: form.nome, dataInicio: form.dataInicio || null, dataFinal: form.dataFinal || null, descricao: form.descricao, status: form.status, codmateriaprima: form.codmateriaprima && form.codmateriaprima !== 'none' ? Number(form.codmateriaprima) : null }) });
            if (!res.ok) { const json = await res.json().catch(() => null); throw new Error(json?.error ?? `Status ${res.status}`); }
            toast.success('Fabricação atualizada com sucesso', { closeButton: true });
            router.push('/fabricacoes');
        } catch (err: unknown) { toast.error(getErrorMessage(err) ?? 'Erro ao atualizar fabricação', { closeButton: true }); } finally { setLoading(false); }
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Voltar">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold">Atualizar Fabricação</h1>
                    <p className="text-sm text-muted-foreground">Atualize os detalhes da fabricação no seu sistema</p>
                </div>
            </div>

            <div className="bg-card border rounded-lg shadow-sm">
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="nome">Nome *</Label>
                                <Input id="nome" name="nome" placeholder="Digite o nome da fabricação" value={form.nome} onChange={handleChange} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="status">Status</Label>

                                <Select
                                    value={form.status}
                                    onValueChange={(value) => setForm((s) => ({ ...s, status: value }))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione o status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="I">I - Iniciado</SelectItem>
                                        <SelectItem value="C">C - Cancelado</SelectItem>
                                        <SelectItem value="EA">EA - Em Andamento</SelectItem>
                                        <SelectItem value="F">F - Finalizado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="dataInicio">Data Início</Label>
                                <Input id="dataInicio" name="dataInicio" type="date" value={form.dataInicio} onChange={handleChange} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="dataFinal">Data Final</Label>
                                <Input id="dataFinal" name="dataFinal" type="date" value={form.dataFinal} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="descricao">Descrição</Label>
                            <Textarea id="descricao" name="descricao" placeholder="Digite a descrição da fabricação" value={form.descricao} onChange={handleChange} rows={3} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="codmateriaprima">Matéria-prima</Label>
                                <Select value={form.codmateriaprima} onValueChange={(v) => setForm(s => ({ ...s, codmateriaprima: v }))}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione uma matéria-prima" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {materias.map((m: { codigo?: number | string; nome?: string | null }) => (
                                            <SelectItem key={String(m.codigo)} value={String(m.codigo)}>{`${m.codigo} - ${m.nome}`}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="ghost" onClick={() => router.back()}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Atualizar Fabricação'}</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
