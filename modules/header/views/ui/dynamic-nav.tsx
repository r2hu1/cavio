"use client";

import { Button } from "@/components/ui/button";
import SettingsNav from "@/modules/settings/views/ui/settings-nav";
import HistoryPopup from "@/modules/ai/views/ui/history-popup";
import DocumentNav from "@/modules/documents/views/ui/document-nav";
import FolderNav from "@/modules/folders/views/ui/folder-nav";
import { Bolt, ClockFading, Share2 } from "lucide-react";
import { usePathname } from "next/navigation";

export default function DynamicNav() {
	const pathname = usePathname().split("/").filter(Boolean);
	const folderPage = pathname.includes("folder") && pathname.length == 2;
	const documentPage = pathname.includes("folder") && pathname.length == 3;
	const settingsPage = pathname.includes("settings");
	const aiPage = pathname.includes("chat");
	const homePage = pathname.length == 0;
	const folderId = pathname[1];
	const documentId = pathname[2];

	return (
		<div className="w-full">
			{homePage && (
				<div className="flex items-center justify-end">
					<HistoryPopup>
						<Button size="icon" className="h-8 w-8" variant="secondary">
							<ClockFading className="!h-3.5 !w-3.5" />
						</Button>
					</HistoryPopup>
				</div>
			)}
			{aiPage && (
				<div className="flex items-center justify-end gap-2">
					<HistoryPopup>
						<Button size="icon" className="h-8 w-8" variant="secondary">
							<ClockFading className="!h-3.5 !w-3.5" />
						</Button>
					</HistoryPopup>
					{/*<Button size="sm">
            Share
            <Share2 className="!h-3.5 !w-3.5" />
          </Button>*/}
				</div>
			)}
			{folderPage && <FolderNav folderId={folderId} />}
			{documentPage && <DocumentNav id={documentId} folderId={folderId} />}
			{settingsPage && <SettingsNav path={pathname} />}
		</div>
	);
}
