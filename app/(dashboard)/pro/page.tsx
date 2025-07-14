import PricingView from "@/modules/pricing/views/ui";
import { Suspense } from "react";

export default async function UpgradePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PricingView />
    </Suspense>
  );
}
