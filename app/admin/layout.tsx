import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { signoutAction } from "@/app/auth/signin/actions";

export const metadata = {
  title: "Admin — Last-minute Gent",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-dvh">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-5 py-3">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="font-semibold">
              Admin
            </Link>
            <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-xs text-white">
              beheer
            </span>
          </div>
          <nav className="flex items-center gap-3 text-sm">
            <Link
              href="/dashboard"
              className="text-zinc-600 hover:text-zinc-900"
            >
              Dashboard
            </Link>
            <form action={signoutAction}>
              <button
                type="submit"
                className="text-zinc-500 hover:text-zinc-900"
              >
                Uitloggen
              </button>
            </form>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
