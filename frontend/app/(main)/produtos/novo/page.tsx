"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export default function NovoProdutoPage() {
    const router = useRouter();
    const [form, setForm] = useState({ nome: "", preco: "", descricao: "", tamanho: "", quantidade: "", codfabricacao: "" });
    const [loading, setLoading] = useState(false);
    const [fabricacoes, setFabricacoes] = useState<Array<{ codigo?: number | string; nome?: string }>>([]);

    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
                const res = await fetch(`${baseUrl}/fabricacoes`);
                if (!res.ok) return;
                const data = await res.json();
                if (mounted) setFabricacoes(data || []);
            } catch {
                console.log("Erro ao carregar fabricações");
            }
        }
        load();
        return () => { mounted = false; };
    }, []);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) { const target = e.target as HTMLInputElement | HTMLTextAreaElement; const { name, value } = target; setForm(s => ({ ...s, [name]: value })); }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); if (!form.nome) return toast.error('Nome obrigatório', { closeButton: true }); setLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
            const res = await fetch(`${baseUrl}/produtos`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nome: form.nome, preco: Number(form.preco || 0), descricao: form.descricao, tamanho: form.tamanho ? Number(form.tamanho) : null, quantidade: form.quantidade ? Number(form.quantidade) : null, codfabricacao: form.codfabricacao && form.codfabricacao !== 'none' ? Number(form.codfabricacao) : null }) });
            if (!res.ok) { const json = await res.json().catch(() => null); throw new Error(json?.error ?? `Status ${res.status}`); }
            toast.success('Produto criado com sucesso', { closeButton: true }); router.push('/produtos');
        } catch (err: unknown) { toast.error(getErrorMessage(err) ?? 'Erro ao criar produto', { closeButton: true }); } finally { setLoading(false); }
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Voltar">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold">Novo Produto</h1>
                    <p className="text-sm text-muted-foreground">Adicione um novo produto ao seu sistema</p>
                </div>
            </div>

            <div className="bg-card border rounded-lg shadow-sm">
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1">
                            <Label htmlFor="nome">Nome</Label>
                            <Input id="nome" name="nome" placeholder="Digite o nome do produto" value={form.nome} onChange={handleChange} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="preco">Preço</Label>
                                <Input id="preco" name="preco" placeholder="Digite o preço do produto" value={form.preco} onChange={handleChange} />
                            </div>
                            <div className="space-y-1"><Label htmlFor="tamanho">Tamanho</Label><Input id="tamanho" name="tamanho" placeholder="Digite o tamanho do produto" value={form.tamanho} onChange={handleChange} /></div></div>
                        <div className="space-y-1">
                            <Label htmlFor="quantidade">Quantidade</Label>
                            <Input id="quantidade" name="quantidade" placeholder="Digite a quantidade do produto" value={form.quantidade} onChange={handleChange} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="codfabricacao">Código Fabricação</Label>
                            <Select value={form.codfabricacao} onValueChange={(v) => setForm(s => ({ ...s, codfabricacao: v }))}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione uma fabricação" />
                                </SelectTrigger>
                                <SelectContent>
                                    {fabricacoes.map((f: { codigo?: number | string; nome?: string | null }) => (
                                        <SelectItem key={String(f.codigo)} value={String(f.codigo)}>{`${f.codigo} - ${f.nome}`}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="descricao">Descrição</Label>
                            <Textarea id="descricao" name="descricao" placeholder="Digite a descrição do produto" value={form.descricao} onChange={handleChange} rows={3} />
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <Button type="button" variant="ghost" onClick={() => router.back()}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Salvando...' : 'Criar Produto'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
