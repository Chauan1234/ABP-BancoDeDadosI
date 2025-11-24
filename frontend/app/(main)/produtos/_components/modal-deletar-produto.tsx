import { toast } from "sonner";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CircleAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import React from "react";
import { getErrorMessage } from "@/lib/utils";

interface Props { open?: boolean; onOpenChange?: (v: boolean) => void; codigo?: number | string | null; onDeleted?: () => void }

export default function DeletarProdutoModal({ open, onOpenChange, codigo, onDeleted }: Props) {
  const [deleting, setDeleting] = React.useState(false);

  async function handleExcluir() {
    if (!codigo) return toast.error('Código inválido', { closeButton: true });
    setDeleting(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
      const res = await fetch(`${baseUrl}/produtos/${codigo}`, { method: 'DELETE' });
      const json = await res.json().catch(() => null);
      if (!res.ok) { toast.error(json?.error ?? `Status ${res.status}`, { closeButton: true }); return; }
      toast.success(json?.message ?? 'Produto removido com sucesso', { closeButton: true });
      if (onDeleted) onDeleted();
    } catch (err: unknown) { toast.error(getErrorMessage(err) ?? 'Erro ao excluir', { closeButton: true }); }
    finally { setDeleting(false); }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="bg-destructive/10 mx-auto mb-2 flex size-12 items-center justify-center rounded-full"><CircleAlertIcon className="text-destructive size-6"/></div>
          <AlertDialogTitle className="text-center">Tem certeza que deseja excluir este produto?</AlertDialogTitle>
          <AlertDialogDescription className="text-center">Esta ação não pode ser desfeita. Isso excluirá permanentemente o produto.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button variant="destructive" onClick={handleExcluir} disabled={deleting}>{deleting ? (<><Spinner className="size-5 text-white"/>Excluindo...</>) : 'Excluir'}</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
