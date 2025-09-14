import SessionPageNav from "./ui/settings-page-nav";

export default function DangerPageView() {
  return (
    <div>
      <SessionPageNav active={"danger"} />
      <div className="mb-10 flex gap-2 items-center justify-between">
        <div>
          <h1 className="font-medium text-lg">Danger</h1>
          <p className="text-sm text-foreground/80">
            Delete, reset, and manage your account. Be careful!
          </p>
        </div>
      </div>
      <div></div>
    </div>
  );
}
