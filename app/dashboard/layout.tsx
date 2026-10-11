import Link from "next/link";
import { requireUser, getOwnBusiness, ADMIN_EMAIL } from "@/lib/auth";
import { signoutAction } from "@/app/auth/signin/actions";

export const metadata = {
  title: "Dashboard — Last-minute Gent",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const business = await getOwnBusiness();

  return (
    <div className="min-h-dvh">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-5 py-3">
          <Link href="/dashboard" className="font-semibold">
            Last-minute Gent
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            {business && (
              <Link
                href="/dashboard/profiel"
                className="text-zinc-600 hover:text-zinc-900"
              >
                Profiel
              </Link>
            )}
            {user.email === ADMIN_EMAIL && (
              <Link
                href="/admin"
                className="text-zinc-600 hover:text-zinc-900"
              >
                Admin
              </Link>
            )}
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
