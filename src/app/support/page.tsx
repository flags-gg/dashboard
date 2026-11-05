import type { Metadata } from "next";
import SupportForm from "~/components/support-form";

export const metadata: Metadata = { title: "Contact support · Flags.gg" };

export default function SupportPage() {
  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Contact support</h1>
        <p className="text-sm text-muted-foreground">Report a problem or suggest a feature. You can send a request even if your account won&apos;t load.</p>
      </header>
      <div className="rounded-lg border bg-background p-6">
        <p className="mb-6 text-sm text-muted-foreground">Tell us what happened, which page you were on, and how we can reach you. Please leave out passwords and API keys.</p>
        <SupportForm />
      </div>
    </section>
  );
}
