import VerifiedEmail from "@/modules/auth/views/ui/verified-email-view";
import { Suspense } from "react";

export default function EmailVerifiedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifiedEmail />
    </Suspense>
  );
}
