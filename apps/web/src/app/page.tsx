import { Bell, FileUp, PenLine, Search, ShieldCheck } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { StatCard } from "@/components/StatCard";
import { documents, matters, metrics, reminders } from "@/lib/data";

export default function Home() {
  return (
    <main className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <header className="border-b border-line bg-white px-5 py-4 md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-slate-600">Professional services automation</p>
              <h2 className="mt-1 text-2xl font-semibold text-ink">AI legal operations dashboard</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="inline-flex items-center gap-2 rounded-md bg-teal px-4 py-2 text-sm font-medium text-white">
                <FileUp size={17} />
                Upload
              </button>
              <button className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-4 py-2 text-sm font-medium text-ink">
                <PenLine size={17} />
                Draft
              </button>
            </div>
          </div>
        </header>

        <section className="space-y-6 px-5 py-6 md:px-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <StatCard key={metric.label} {...metric} />
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Client matters</h3>
                <ShieldCheck className="text-teal" size={20} />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="border-b border-line text-slate-500">
                    <tr>
                      <th className="py-3 font-medium">Client</th>
                      <th className="py-3 font-medium">Matter</th>
                      <th className="py-3 font-medium">Status</th>
                      <th className="py-3 font-medium">Due</th>
                      <th className="py-3 font-medium">Owner</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {matters.map((matter) => (
                      <tr key={matter.client}>
                        <td className="py-4 font-medium text-ink">{matter.client}</td>
                        <td className="py-4 text-slate-700">{matter.type}</td>
                        <td className="py-4 text-slate-700">{matter.status}</td>
                        <td className="py-4 text-coral">{matter.due}</td>
                        <td className="py-4 text-slate-700">{matter.owner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Reminder queue</h3>
                <Bell className="text-gold" size={20} />
              </div>
              <div className="space-y-3">
                {reminders.map((reminder) => (
                  <label className="flex items-center gap-3 rounded-md border border-line p-3 text-sm" key={reminder}>
                    <input className="h-4 w-4 accent-teal" type="checkbox" />
                    {reminder}
                  </label>
                ))}
              </div>
            </section>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Document intelligence</h3>
                <FileUp className="text-teal" size={20} />
              </div>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div className="flex items-center justify-between rounded-md border border-line p-3" key={doc.name}>
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-slate-600">{doc.tag}</p>
                    </div>
                    <span className="text-sm text-teal">{doc.confidence}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">AI search</h3>
                <Search className="text-teal" size={20} />
              </div>
              <div className="rounded-md border border-line bg-mist p-4">
                <input
                  className="w-full rounded-md border border-line bg-white px-4 py-3 text-sm outline-none focus:border-teal"
                  placeholder="Find all records related to a client, deadline, or document"
                />
                <div className="mt-4 rounded-md bg-white p-4 text-sm text-slate-700">
                  Suggested result: medical record summary linked to John Smith, due for review on 16 May 2026.
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

