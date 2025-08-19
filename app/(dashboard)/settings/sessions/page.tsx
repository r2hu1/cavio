import PageLoader from "@/modules/preloader/views/ui/page-loader";
import SessionsPageView from "@/modules/settings/views/ui/sessions-page-view";
import { Suspense } from "react";

export default async function SessionsPage() {
	return (
		<Suspense fallback={<PageLoader />}>
			<SessionsPageView />
		</Suspense>
	);
}
