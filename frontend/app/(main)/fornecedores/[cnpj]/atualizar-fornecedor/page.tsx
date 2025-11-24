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

export default function AtualizarFornecedorPage() {
  const params = useParams();
  const cnpj = params?.cnpj;
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
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!cnpj) return;
      setLoadingData(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
        const res = await fetch(`${baseUrl}/fornecedores/${cnpj}`);
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        const data = await res.json();
        if (mounted) {
          setForm({
            cnpj: String(data.cnpj ?? cnpj),
            nome: data.nome ?? "",
            endereco: data.endereco ?? "",
            pais: data.pais ?? "",
            telefone: data.telefone ?? "",
            email: data.email ?? "",
          });
        }
      } catch (err: unknown) {
        toast.error(getErrorMessage(err) ?? "Erro ao carregar fornecedor", { closeButton: true });
      } finally {
        if (mounted) setLoadingData(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [cnpj]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cnpj) return toast.error("CNPJ inválido", { closeButton: true });

    if (!form.cnpj || !form.nome || !form.endereco) {
      toast.error("Preencha os campos obrigatórios: CNPJ, Nome e Endereço", { closeButton: true });
      return;
    }

    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
      const res = await fetch(`${baseUrl}/fornecedores/${cnpj}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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

      toast.success("Fornecedor atualizado com sucesso", { closeButton: true });
      router.push("/fornecedores");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err) ?? "Erro ao atualizar fornecedor", { closeButton: true });
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
          <h1 className="text-2xl font-semibold">Atualizar Fornecedor</h1>
          <p className="text-sm text-muted-foreground">Altere as informações do fornecedor</p>
        </div>
      </div>

      <div className="bg-card border rounded-lg shadow-sm">
        <div className="p-6">
          {loadingData ? (
            <div className="p-4">Carregando informações...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input id="cnpj" name="cnpj" value={form.cnpj} readOnly />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="nome">Nome *</Label>
                  <Input id="nome" name="nome" value={form.nome} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="endereco">Endereço *</Label>
                <Textarea id="endereco" name="endereco" value={form.endereco} onChange={handleChange} rows={3} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="pais">País</Label>
                  <Input id="pais" name="pais" value={form.pais} onChange={handleChange} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" name="telefone" value={form.telefone} onChange={handleChange} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" value={form.email} onChange={handleChange} />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => router.back()}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Salvando..." : "Atualizar Fornecedor"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
// file ends