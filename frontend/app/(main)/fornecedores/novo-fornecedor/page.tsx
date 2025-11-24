"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export default function NovoFornecedorPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        cnpj: "",
        nome: "",
        endereco: "",
        pais: "",
        telefone: "",
        email: "",
    });
    const [loading, setLoading] = useState(false);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!form.cnpj || !form.nome || !form.endereco) {
            toast.error("Preencha os campos obrigatórios: CNPJ, Nome e Endereço");
            return;
        }

        setLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
            const res = await fetch(`${baseUrl}/fornecedores`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cnpj: Number(form.cnpj),
                    nome: form.nome,
                    endereco: form.endereco,
                    pais: form.pais,
                    telefone: form.telefone,
                    email: form.email,
                }),
            });

            if (!res.ok) {
                const json = await res.json().catch(() => null);
                throw new Error(json?.error ?? `Status ${res.status}`);
            }

            toast.success("Fornecedor criado com sucesso");
            router.push("/fornecedores");
        } catch (err: unknown) {
            toast.error(getErrorMessage(err) ?? "Erro ao criar fornecedor");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Voltar">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold">Novo Fornecedor</h1>
                    <p className="text-sm text-muted-foreground">Adicione um novo fornecedor ao seu sistema</p>
                </div>
            </div>

            <div className="bg-card border rounded-lg shadow-sm">
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="cnpj">CNPJ *</Label>
                                <Input
                                    id="cnpj"
                                    name="cnpj"
                                    value={form.cnpj}
                                    onChange={handleChange}
                                    placeholder="Somente números"
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="nome">Nome *</Label>
                                <Input
                                    id="nome"
                                    name="nome"
                                    value={form.nome}
                                    onChange={handleChange}
                                    placeholder="Nome do fornecedor"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="endereco">Endereço *</Label>
                            <Textarea
                                id="endereco"
                                name="endereco"
                                value={form.endereco}
                                onChange={handleChange}
                                placeholder="Rua, número, bairro, cidade"
                                className="max-h-[200px]"
                                maxLength={255}
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="pais">País</Label>
                                <Input id="pais" name="pais" placeholder="Brasil" value={form.pais} onChange={handleChange} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="telefone">Telefone</Label>
                                <Input id="telefone" name="telefone" placeholder="+55 (11) 91234-5678" value={form.telefone} onChange={handleChange} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" placeholder="example@gmail.com" value={form.email} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <Button type="button" variant="ghost" onClick={() => router.back()}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Salvando..." : "Criar Fornecedor"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}