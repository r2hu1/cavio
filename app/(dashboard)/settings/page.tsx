import PageLoader from "@/modules/preloader/views/ui/page-loader";
import SettingsPageView from "@/modules/settings/views/ui/settings-page-view";
import { Suspense } from "react";

export default async function AccountPage() {
	return (
		<Suspense fallback={<PageLoader />}>
			<SettingsPageView />
		</Suspense>
	);
}
