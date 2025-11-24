import { toast } from "sonner";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CircleAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import React from "react";
import { getErrorMessage } from "@/lib/utils";

// Props
interface ExcluirItemModalProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    cnpj?: string | null;
    onDeleted?: () => void;
}

export default function DeletarFornecedorModal({ open, onOpenChange, cnpj, onDeleted }: ExcluirItemModalProps) {
    const [deleting, setDeleting] = React.useState(false);

    async function handleExcluirItem() {
        if (!cnpj) {
            toast.error("CNPJ inválido", { closeButton: true });
            return;
        }

        setDeleting(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
            const res = await fetch(`${baseUrl}/fornecedores/${cnpj}`, {
                method: 'DELETE'
            });

            const json = await res.json().catch(() => null);
            if (!res.ok) {
                const msg = json?.error ?? `Status ${res.status}`;
                toast.error(msg, { closeButton: true });
                return;
            }

            toast.success(json?.message ?? 'Fornecedor removido com sucesso', { closeButton: true });
            if (onDeleted) onDeleted();
        } catch (err: unknown) {
            toast.error(getErrorMessage(err) ?? 'Erro ao excluir fornecedor', { closeButton: true });
        } finally {
            setDeleting(false);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="gap-2">
                <AlertDialogHeader className="mb-2 gap-0">
                    <div className="bg-destructive/10 mx-auto mb-2 flex size-12 items-center justify-center rounded-full">
                        <CircleAlertIcon className="text-destructive size-6" />
                    </div>
                    <AlertDialogTitle className="text-center">Tem certeza que deseja excluir este fornecedor?</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-muted-foreground text-center mt-1">
                        Esta ação não pode ser desfeita. Isso excluirá permanentemente o fornecedor.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                
                <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <Button
                        variant="destructive"
                        onClick={handleExcluirItem}
                        disabled={deleting}
                    >
                        {deleting ? (
                            <>
                                <Spinner className="size-5 text-white" />
                                <span>Excluindo...</span>
                            </>
                        ) : 'Excluir'}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}