import { Logo } from "@/components/marketing/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo className="text-2xl" />
        </div>
        <div className="rounded-lg border border-border bg-card p-8 shadow-lg">
          {children}
        </div>
      </div>
    </main>
  );
}
