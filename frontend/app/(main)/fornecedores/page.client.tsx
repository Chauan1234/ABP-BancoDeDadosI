import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function FornecedoresPage() {
    return (
        <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
            <div className="max-h-[530px] relative overflow-auto">
                <Table>
                    <TableHeader className="bg-muted sticky top-0">
                        <TableRow>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                </Table>
            </div>
        </div>
    )
}