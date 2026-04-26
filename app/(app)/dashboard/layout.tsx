import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen w-full p-4 md:p-6">
      <header className="mb-6 flex items-center justify-between border-b border-slate-300 pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-agc-navy">AGC Newsletter Builder</h1>
          <p className="text-sm text-slate-600">Logged in as {session.user.email}</p>
        </div>
        <Link className="border border-slate-300 bg-white px-3 py-2" href="/api/auth/signout">
          Sign out
        </Link>
      </header>
      {children}
    </div>
  );
}
