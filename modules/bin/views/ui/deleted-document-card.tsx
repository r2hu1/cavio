import { FileText, RotateCcw, Trash2 } from "lucide-react";
import { formatDeletedDate } from "../../utils";
import { Button } from "@/components/ui/button";
import {
	Credenza,
	CredenzaClose,
	CredenzaContent,
	CredenzaDescription,
	CredenzaFooter,
	CredenzaHeader,
	CredenzaTitle,
	CredenzaTrigger,
} from "@/components/ui/credenza";

export default function DeletedDocumentCard({
	doc,
	daysRemaining,
	onDelete,
	onRestore,
	isPending,
}: {
	doc: any;
	daysRemaining: number;
	onDelete: (id: string) => void;
	onRestore: (id: string) => void;
	isPending: boolean;
}) {
	return (
		<div
			key={doc.id}
			className="group flex items-center justify-between rounded-xl border border-border/40 bg-muted/20 hover:bg-muted/30 px-4 py-3 transition"
		>
			<div className="flex items-center gap-3">
				<FileText className="h-4 w-4 text-muted-foreground" />
				<div>
					<p className="text-sm">{doc.title || "Untitled Document"}</p>
					<p className="text-xs text-muted-foreground">
						Deleted {formatDeletedDate(doc.deletedAt)} • {daysRemaining}d left
					</p>
				</div>
			</div>

			<div className="flex items-center gap-2">
				<Button
					variant="secondary"
					size="icon"
					className="h-8 w-8"
					onClick={() => onRestore(doc.id)}
					disabled={isPending}
				>
					<RotateCcw className="h-4 w-4" />
				</Button>

				<Credenza>
					<CredenzaTrigger asChild>
						<Button size="icon" disabled={isPending} className="h-8 w-8">
							<Trash2 className="h-4 w-4" />
						</Button>
					</CredenzaTrigger>
					<CredenzaContent>
						<CredenzaHeader>
							<CredenzaTitle>Permanently delete?</CredenzaTitle>
							<CredenzaDescription>
								This action cannot be undone.
							</CredenzaDescription>
						</CredenzaHeader>
						<CredenzaFooter>
							<CredenzaClose asChild>
								<Button variant="secondary">Cancel</Button>
							</CredenzaClose>
							<Button
								variant="destructive"
								disabled={isPending}
								onClick={() => onDelete(doc.id)}
							>
								Delete
							</Button>
						</CredenzaFooter>
					</CredenzaContent>
				</Credenza>
			</div>
		</div>
	);
}
