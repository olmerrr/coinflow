import { auth } from "@/auth";
import { MarketsPanel } from "@/components/markets-panel";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <main className="mx-auto w-full min-w-0 max-w-6xl flex-1 overflow-x-clip py-6 pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))] sm:py-10 sm:pl-[max(1.5rem,env(safe-area-inset-left,0px))] sm:pr-[max(1.5rem,env(safe-area-inset-right,0px))]">
      <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
        Dashboard
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Signed in as{" "}
        <span className="font-medium text-slate-800">{session.user.email}</span>
      </p>
      <section className="mt-10">
        <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
          Top markets (USD)
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Data from CoinGecko via server proxy. Not financial advice.
        </p>
        <div className="mt-6">
          <MarketsPanel />
        </div>
      </section>
    </main>
  );
}
