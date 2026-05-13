"use client";

import {
  BarChart3,
  Bell,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  FileText,
  FolderKanban,
  Lock,
  Mic,
  Plus,
  RotateCcw,
  Search,
  Send,
  Settings,
  Upload,
  Users,
  Wand2,
  X
} from "lucide-react";
import { ChangeEvent, FormEvent, ReactNode, useEffect, useMemo, useState } from "react";

type View = "dashboard" | "team" | "clients" | "documents" | "drafting" | "reminders" | "transcription" | "search" | "analytics" | "settings";
type Client = { id: string; name: string; email: string; phone: string; matter: string; status: string; priority: "High" | "Medium" | "Low"; notes: string; createdAt: string };
type DocumentRecord = { id: string; name: string; client: string; type: string; size: string; status: string; extracted: string; uploadedAt: string };
type Reminder = { id: string; title: string; client: string; channel: string; due: string; status: "Pending" | "Sent" | "Overdue" };
type Draft = { id: string; type: string; client: string; prompt: string; output: string; createdAt: string };
type Transcript = { id: string; client: string; source: string; summary: string; actions: string[]; createdAt: string };
type TeamMember = { id: string; name: string; role: string; access: string };

const today = new Date().toISOString().slice(0, 10);

const starter = {
  clients: [
    { id: "c1", name: "John Smith", email: "john@example.com", phone: "+61 400 000 001", matter: "Personal Injury", status: "Active", priority: "High" as const, notes: "Awaiting bank statements and medical records.", createdAt: "Today" },
    { id: "c2", name: "Anna Lee", email: "anna@example.com", phone: "+61 400 000 002", matter: "Family Law", status: "Review", priority: "Medium" as const, notes: "Prepare mediation file note.", createdAt: "Yesterday" },
    { id: "c3", name: "Raj Mehta", email: "raj@example.com", phone: "+61 400 000 003", matter: "Migration", status: "Drafting", priority: "High" as const, notes: "Draft submission letter.", createdAt: "2 days ago" }
  ],
  documents: [
    { id: "d1", name: "authority_signed.pdf", client: "Raj Mehta", type: "Authority", size: "240 KB", status: "Extracted", extracted: "Detected signed authority, date, client name, and witness field.", uploadedAt: "Today" },
    { id: "d2", name: "hospital_records.pdf", client: "John Smith", type: "Medical", size: "1.8 MB", status: "Extracted", extracted: "Detected hospital name, admission date, discharge notes, and treatment summary.", uploadedAt: "Yesterday" }
  ],
  reminders: [
    { id: "r1", title: "Request bank statements", client: "John Smith", channel: "Email", due: today, status: "Pending" as const },
    { id: "r2", title: "Send draft for review", client: "Raj Mehta", channel: "Email + SMS", due: today, status: "Pending" as const },
    { id: "r3", title: "Confirm mediation appointment", client: "Anna Lee", channel: "SMS", due: "2026-05-12", status: "Overdue" as const }
  ],
  drafts: [
    { id: "g1", type: "Letter", client: "Raj Mehta", prompt: "Draft a migration document request email.", output: "Dear Raj, please provide the remaining identity and financial documents so we can complete your submission review.", createdAt: "Today" }
  ],
  transcripts: [
    { id: "t1", client: "Anna Lee", source: "Client call notes", summary: "Client confirmed mediation date and requested a copy of the draft position statement.", actions: ["Send draft statement", "Confirm appointment time"], createdAt: "Yesterday" }
  ],
  team: [
    { id: "u1", name: "Emtiaz Ahamed", role: "Owner", access: "Admin" },
    { id: "u2", name: "Legal Assistant", role: "Operations", access: "Editor" }
  ]
};

const nav = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "team", label: "Team & Roles", icon: Lock },
  { id: "clients", label: "Clients", icon: Users },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "drafting", label: "AI Drafting", icon: Wand2 },
  { id: "reminders", label: "Reminders", icon: Bell },
  { id: "transcription", label: "Transcription", icon: Mic },
  { id: "search", label: "AI Search", icon: Search },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings }
] satisfies { id: View; label: string; icon: typeof BarChart3 }[];

function id(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadState<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T) : fallback;
}

function saveState<T>(key: string, value: T) {
  if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(value));
}

export default function Home() {
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<View>("dashboard");
  const [toast, setToast] = useState("");
  const [clients, setClients] = useState<Client[]>(starter.clients);
  const [documents, setDocuments] = useState<DocumentRecord[]>(starter.documents);
  const [reminders, setReminders] = useState<Reminder[]>(starter.reminders);
  const [drafts, setDrafts] = useState<Draft[]>(starter.drafts);
  const [transcripts, setTranscripts] = useState<Transcript[]>(starter.transcripts);
  const [team, setTeam] = useState<TeamMember[]>(starter.team);
  const [modal, setModal] = useState<"client" | "reminder" | "team" | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setClients(loadState("flowops.clients", starter.clients));
    setDocuments(loadState("flowops.documents", starter.documents));
    setReminders(loadState("flowops.reminders", starter.reminders));
    setDrafts(loadState("flowops.drafts", starter.drafts));
    setTranscripts(loadState("flowops.transcripts", starter.transcripts));
    setTeam(loadState("flowops.team", starter.team));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveState("flowops.clients", clients);
    saveState("flowops.documents", documents);
    saveState("flowops.reminders", reminders);
    saveState("flowops.drafts", drafts);
    saveState("flowops.transcripts", transcripts);
    saveState("flowops.team", team);
  }, [ready, clients, documents, reminders, drafts, transcripts, team]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  }

  function resetWorkspace() {
    setClients([]);
    setDocuments([]);
    setReminders([]);
    setDrafts([]);
    setTranscripts([]);
    setTeam([{ id: id("u"), name: "Workspace Owner", role: "Owner", access: "Admin" }]);
    notify("Fresh workspace started");
  }

  function restoreDemo() {
    setClients(starter.clients);
    setDocuments(starter.documents);
    setReminders(starter.reminders);
    setDrafts(starter.drafts);
    setTranscripts(starter.transcripts);
    setTeam(starter.team);
    notify("Sample data restored");
  }

  const stats = useMemo(() => {
    const pendingDocs = documents.filter((doc) => doc.status !== "Extracted").length;
    const overdue = reminders.filter((reminder) => reminder.status === "Overdue").length;
    const hours = documents.length * 2 + drafts.length * 3 + transcripts.length;
    return [
      { label: "Active clients", value: clients.length, color: "gold", note: "Central CRM" },
      { label: "Documents", value: documents.length, color: "green", note: `${pendingDocs} pending` },
      { label: "Open reminders", value: reminders.filter((reminder) => reminder.status !== "Sent").length, color: overdue ? "red" : "gold", note: `${overdue} overdue` },
      { label: "Hours saved", value: `${hours}h`, color: "gold", note: "AI estimate" }
    ];
  }, [clients, documents, reminders, drafts, transcripts]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return [
      ...clients.map((item) => ({ type: "Client", title: item.name, body: `${item.matter} ${item.status} ${item.notes}` })),
      ...documents.map((item) => ({ type: "Document", title: item.name, body: `${item.client} ${item.type} ${item.extracted}` })),
      ...reminders.map((item) => ({ type: "Reminder", title: item.title, body: `${item.client} ${item.channel} ${item.status}` })),
      ...drafts.map((item) => ({ type: "Draft", title: item.type, body: `${item.client} ${item.prompt} ${item.output}` })),
      ...transcripts.map((item) => ({ type: "Transcript", title: item.client, body: `${item.source} ${item.summary} ${item.actions.join(" ")}` }))
    ].filter((item) => `${item.title} ${item.body}`.toLowerCase().includes(q));
  }, [clients, documents, reminders, drafts, transcripts, query]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#060e1c] text-[#e8d5b0]">
      <div className="flex h-screen">
        <aside className="hidden w-[232px] shrink-0 flex-col border-r border-white/10 bg-[#0a1628] lg:flex">
          <div className="border-b border-white/10 px-5 py-5">
            <div className="font-serif text-xl font-bold text-[#c9a84c]">FlowOps <span className="font-light text-[#8eaecb]">AI</span></div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#4a6a85]">Practice Suite</div>
          </div>
          <nav className="flex-1 overflow-y-auto px-2 py-4">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = view === item.id;
              return (
                <button
                  className={`mb-1 flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition ${active ? "border-[#c9a84c]/30 bg-[#c9a84c]/10 text-[#c9a84c]" : "border-transparent text-[#8eaecb] hover:bg-[#0d1f38] hover:text-[#e8d5b0]"}`}
                  key={item.id}
                  onClick={() => setView(item.id)}
                  title={item.label}
                >
                  <Icon size={17} />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div className="border-t border-white/10 p-3">
            <div className="rounded-lg border border-white/10 bg-[#0d1f38] p-3">
              <div className="text-sm font-medium">Workspace Owner</div>
              <div className="mt-1 text-xs text-[#4a6a85]">Admin access</div>
            </div>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex min-h-14 items-center gap-3 border-b border-white/10 bg-[#0a1628] px-4 md:px-6">
            <div className="min-w-0 flex-1">
              <h1 className="truncate font-serif text-lg font-semibold">{nav.find((item) => item.id === view)?.label}</h1>
            </div>
            <button className="rounded-md border border-white/10 px-3 py-2 text-xs text-[#8eaecb] hover:bg-[#0d1f38]" onClick={restoreDemo}>
              Sample data
            </button>
            <button className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-xs text-[#8eaecb] hover:bg-[#0d1f38]" onClick={resetWorkspace}>
              <RotateCcw size={14} />
              Fresh start
            </button>
            <button className="inline-flex items-center gap-2 rounded-md bg-[#c9a84c] px-3 py-2 text-xs font-medium text-[#060e1c]" onClick={() => setModal("client")}>
              <Plus size={14} />
              Client
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {view === "dashboard" && <Dashboard stats={stats} clients={clients} documents={documents} reminders={reminders} drafts={drafts} setView={setView} />}
            {view === "team" && <TeamView team={team} setModal={setModal} />}
            {view === "clients" && <ClientsView clients={clients} setModal={setModal} />}
            {view === "documents" && <DocumentsView clients={clients} documents={documents} setDocuments={setDocuments} notify={notify} />}
            {view === "drafting" && <DraftingView clients={clients} drafts={drafts} setDrafts={setDrafts} notify={notify} />}
            {view === "reminders" && <RemindersView reminders={reminders} setReminders={setReminders} setModal={setModal} notify={notify} />}
            {view === "transcription" && <TranscriptionView clients={clients} transcripts={transcripts} setTranscripts={setTranscripts} notify={notify} />}
            {view === "search" && <SearchView query={query} setQuery={setQuery} results={searchResults} />}
            {view === "analytics" && <AnalyticsView stats={stats} documents={documents} drafts={drafts} reminders={reminders} transcripts={transcripts} />}
            {view === "settings" && <SettingsView notify={notify} />}
          </div>
        </section>
      </div>

      {modal === "client" && <ClientModal close={() => setModal(null)} setClients={setClients} notify={notify} />}
      {modal === "reminder" && <ReminderModal close={() => setModal(null)} clients={clients} setReminders={setReminders} notify={notify} />}
      {modal === "team" && <TeamModal close={() => setModal(null)} setTeam={setTeam} notify={notify} />}
      <Toast message={toast} />
    </main>
  );
}

function Panel({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-xl border border-white/10 bg-[#0a1628]">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <h2 className="font-serif text-base font-semibold">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Dashboard({ stats, clients, documents, reminders, drafts, setView }: { stats: { label: string; value: number | string; color: string; note: string }[]; clients: Client[]; documents: DocumentRecord[]; reminders: Reminder[]; drafts: Draft[]; setView: (view: View) => void }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div className="rounded-xl border border-white/10 bg-[#0a1628] p-5" key={stat.label}>
            <div className="text-[11px] uppercase tracking-[0.16em] text-[#4a6a85]">{stat.label}</div>
            <div className={`mt-3 font-serif text-4xl font-semibold ${stat.color === "red" ? "text-[#e05555]" : stat.color === "green" ? "text-[#3eb87a]" : "text-[#c9a84c]"}`}>{stat.value}</div>
            <div className="mt-2 text-xs text-[#8eaecb]">{stat.note}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Panel title="Active client matters" action={<button className="text-xs text-[#c9a84c]" onClick={() => setView("clients")}>View all</button>}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="text-[10px] uppercase tracking-[0.14em] text-[#4a6a85]">
                <tr><th className="pb-3">Client</th><th className="pb-3">Matter</th><th className="pb-3">Status</th><th className="pb-3">Priority</th></tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {clients.slice(0, 5).map((client) => (
                  <tr className="text-[#8eaecb]" key={client.id}>
                    <td className="py-3 font-medium text-[#e8d5b0]">{client.name}</td>
                    <td className="py-3">{client.matter}</td>
                    <td className="py-3"><Badge tone="blue">{client.status}</Badge></td>
                    <td className="py-3"><Badge tone={client.priority === "High" ? "red" : "gold"}>{client.priority}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Reminder queue" action={<button className="text-xs text-[#c9a84c]" onClick={() => setView("reminders")}>Open</button>}>
          <div className="space-y-3">
            {reminders.slice(0, 5).map((reminder) => (
              <div className="rounded-lg border border-white/10 bg-[#0d1f38] p-3" key={reminder.id}>
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium">{reminder.title}</div>
                  <Badge tone={reminder.status === "Overdue" ? "red" : "gold"}>{reminder.status}</Badge>
                </div>
                <div className="mt-1 text-xs text-[#8eaecb]">{reminder.client} via {reminder.channel} due {reminder.due}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <MiniModule icon={<Upload />} title="Document processing" value={`${documents.length} files`} onClick={() => setView("documents")} />
        <MiniModule icon={<Bot />} title="AI drafting" value={`${drafts.length} drafts`} onClick={() => setView("drafting")} />
        <MiniModule icon={<FileSearch />} title="Smart search" value="All records" onClick={() => setView("search")} />
      </div>
    </div>
  );
}

function MiniModule({ icon, title, value, onClick }: { icon: ReactNode; title: string; value: string; onClick: () => void }) {
  return (
    <button className="rounded-xl border border-white/10 bg-[#0a1628] p-5 text-left transition hover:border-[#c9a84c]/40 hover:bg-[#0d1f38]" onClick={onClick}>
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#c9a84c]/10 text-[#c9a84c]">{icon}</div>
      <div className="font-medium">{title}</div>
      <div className="mt-1 text-sm text-[#8eaecb]">{value}</div>
    </button>
  );
}

function TeamView({ team, setModal }: { team: TeamMember[]; setModal: (modal: "team") => void }) {
  return (
    <Panel title="User and team management" action={<button className="rounded-md bg-[#c9a84c] px-3 py-2 text-xs font-medium text-[#060e1c]" onClick={() => setModal("team")}>Add user</button>}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {team.map((member) => (
          <div className="rounded-xl border border-white/10 bg-[#0d1f38] p-4" key={member.id}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c9a84c]/30 bg-[#c9a84c]/10 font-serif text-[#c9a84c]">{member.name.slice(0, 2).toUpperCase()}</div>
              <div>
                <div className="font-medium">{member.name}</div>
                <div className="text-xs text-[#8eaecb]">{member.role}</div>
              </div>
            </div>
            <div className="mt-4"><Badge tone={member.access === "Admin" ? "gold" : "blue"}>{member.access}</Badge></div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ClientsView({ clients, setModal }: { clients: Client[]; setModal: (modal: "client") => void }) {
  return (
    <Panel title="Client management" action={<button className="rounded-md bg-[#c9a84c] px-3 py-2 text-xs font-medium text-[#060e1c]" onClick={() => setModal("client")}>Add client</button>}>
      <ResponsiveTable headers={["Client", "Matter", "Email", "Status", "Priority"]}>
        {clients.map((client) => (
          <tr className="border-b border-white/10 text-[#8eaecb]" key={client.id}>
            <td className="py-3 font-medium text-[#e8d5b0]">{client.name}</td>
            <td className="py-3">{client.matter}</td>
            <td className="py-3">{client.email}</td>
            <td className="py-3"><Badge tone="blue">{client.status}</Badge></td>
            <td className="py-3"><Badge tone={client.priority === "High" ? "red" : client.priority === "Medium" ? "gold" : "green"}>{client.priority}</Badge></td>
          </tr>
        ))}
      </ResponsiveTable>
    </Panel>
  );
}

function DocumentsView({ clients, documents, setDocuments, notify }: { clients: Client[]; documents: DocumentRecord[]; setDocuments: (updater: (items: DocumentRecord[]) => DocumentRecord[]) => void; notify: (message: string) => void }) {
  const [client, setClient] = useState(clients[0]?.name || "Unassigned");
  const [type, setType] = useState("General");

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    const records: DocumentRecord[] = Array.from(files).map((file) => ({
      id: id("d"),
      name: file.name,
      client,
      type,
      size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      status: "Extracted",
      extracted: `Extracted document name, owner (${client}), file type (${type}), upload date, and review status. OCR text preview is ready for AI review.`,
      uploadedAt: "Just now"
    }));
    setDocuments((items) => [...records, ...items]);
    notify(`${records.length} document${records.length > 1 ? "s" : ""} uploaded and processed`);
  }

  return (
    <div className="space-y-4">
      <Panel title="Upload and process documents">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <select className="form-field" value={client} onChange={(event) => setClient(event.target.value)}>
            {[...clients.map((item) => item.name), "Unassigned"].map((name) => <option key={name}>{name}</option>)}
          </select>
          <select className="form-field" value={type} onChange={(event) => setType(event.target.value)}>
            {["General", "Medical", "Identity", "Authority", "Financial", "Contract", "Legal Draft"].map((name) => <option key={name}>{name}</option>)}
          </select>
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-[#c9a84c] px-4 py-3 text-sm font-medium text-[#060e1c]">
            <Upload size={16} />
            Upload files
            <input className="hidden" type="file" multiple onChange={(event) => upload(event.target.files)} />
          </label>
        </div>
      </Panel>
      <Panel title="Document inbox">
        <ResponsiveTable headers={["Document", "Client", "Type", "Size", "AI Status", "Extraction"]}>
          {documents.map((doc) => (
            <tr className="border-b border-white/10 text-[#8eaecb]" key={doc.id}>
              <td className="py-3 font-medium text-[#e8d5b0]">{doc.name}</td>
              <td className="py-3">{doc.client}</td>
              <td className="py-3"><Badge tone="blue">{doc.type}</Badge></td>
              <td className="py-3">{doc.size}</td>
              <td className="py-3"><Badge tone="green">{doc.status}</Badge></td>
              <td className="max-w-[360px] py-3 text-xs">{doc.extracted}</td>
            </tr>
          ))}
        </ResponsiveTable>
      </Panel>
    </div>
  );
}

function DraftingView({ clients, drafts, setDrafts, notify }: { clients: Client[]; drafts: Draft[]; setDrafts: (updater: (items: Draft[]) => Draft[]) => void; notify: (message: string) => void }) {
  const [client, setClient] = useState(clients[0]?.name || "Unassigned");
  const [type, setType] = useState("Legal Summary");
  const [prompt, setPrompt] = useState("");

  function generate() {
    const clean = prompt.trim();
    if (!clean) return notify("Add a prompt first");
    const output = `Draft ${type.toLowerCase()} for ${client}.\n\nSummary: ${clean}\n\nRecommended next steps:\n1. Confirm facts with the client.\n2. Attach supporting documents.\n3. Human reviewer to approve before sending.`;
    setDrafts((items) => [{ id: id("g"), type, client, prompt: clean, output, createdAt: "Just now" }, ...items]);
    setPrompt("");
    notify("Draft generated and saved");
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
      <Panel title="AI drafting assistant">
        <div className="space-y-3">
          <select className="form-field" value={client} onChange={(event) => setClient(event.target.value)}>
            {[...clients.map((item) => item.name), "Unassigned"].map((name) => <option key={name}>{name}</option>)}
          </select>
          <select className="form-field" value={type} onChange={(event) => setType(event.target.value)}>
            {["Legal Summary", "Client Email", "Contract Clause", "Statement", "Missing Document Request", "File Note"].map((name) => <option key={name}>{name}</option>)}
          </select>
          <textarea className="form-field min-h-40" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Example: Create a legal summary from hospital records and list missing evidence." />
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#c9a84c] px-4 py-3 text-sm font-medium text-[#060e1c]" onClick={generate}><Wand2 size={16} />Generate draft</button>
        </div>
      </Panel>
      <Panel title="Generated drafts">
        <div className="space-y-3">
          {drafts.map((draft) => (
            <article className="rounded-lg border border-white/10 bg-[#0d1f38] p-4" key={draft.id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-medium">{draft.type} for {draft.client}</div>
                <Badge tone="gold">{draft.createdAt}</Badge>
              </div>
              <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-[#060e1c] p-3 text-xs leading-6 text-[#8eaecb]">{draft.output}</pre>
            </article>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function RemindersView({ reminders, setReminders, setModal, notify }: { reminders: Reminder[]; setReminders: (updater: (items: Reminder[]) => Reminder[]) => void; setModal: (modal: "reminder") => void; notify: (message: string) => void }) {
  function markSent(idValue: string) {
    setReminders((items) => items.map((item) => item.id === idValue ? { ...item, status: "Sent" } : item));
    notify("Reminder marked as sent");
  }

  return (
    <Panel title="Reminder automation" action={<button className="rounded-md bg-[#c9a84c] px-3 py-2 text-xs font-medium text-[#060e1c]" onClick={() => setModal("reminder")}>Add reminder</button>}>
      <div className="space-y-3">
        {reminders.map((reminder) => (
          <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-[#0d1f38] p-4 md:flex-row md:items-center md:justify-between" key={reminder.id}>
            <div>
              <div className="font-medium">{reminder.title}</div>
              <div className="mt-1 text-xs text-[#8eaecb]">{reminder.client} via {reminder.channel} due {reminder.due}</div>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone={reminder.status === "Sent" ? "green" : reminder.status === "Overdue" ? "red" : "gold"}>{reminder.status}</Badge>
              {reminder.status !== "Sent" && <button className="rounded-md border border-white/10 px-3 py-2 text-xs text-[#8eaecb]" onClick={() => markSent(reminder.id)}>Mark sent</button>}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function TranscriptionView({ clients, transcripts, setTranscripts, notify }: { clients: Client[]; transcripts: Transcript[]; setTranscripts: (updater: (items: Transcript[]) => Transcript[]) => void; notify: (message: string) => void }) {
  const [client, setClient] = useState(clients[0]?.name || "Unassigned");
  const [source, setSource] = useState("");

  function summarize() {
    const text = source.trim();
    if (!text) return notify("Paste transcript notes first");
    const sentences = text.split(/[.!?]/).map((item) => item.trim()).filter(Boolean);
    const actions = sentences.filter((item) => /send|call|review|confirm|prepare|upload|follow/i.test(item)).slice(0, 4);
    setTranscripts((items) => [{
      id: id("t"),
      client,
      source: text.slice(0, 80),
      summary: sentences.slice(0, 2).join(". ") || "Meeting summary generated.",
      actions: actions.length ? actions : ["Review file note", "Confirm next action with client"],
      createdAt: "Just now"
    }, ...items]);
    setSource("");
    notify("Transcript summarized");
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Panel title="Meeting transcription">
        <div className="space-y-3">
          <select className="form-field" value={client} onChange={(event) => setClient(event.target.value)}>
            {[...clients.map((item) => item.name), "Unassigned"].map((name) => <option key={name}>{name}</option>)}
          </select>
          <textarea className="form-field min-h-56" value={source} onChange={(event) => setSource(event.target.value)} placeholder="Paste call transcript or meeting notes. The app will produce a summary and action items." />
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#c9a84c] px-4 py-3 text-sm font-medium text-[#060e1c]" onClick={summarize}><Mic size={16} />Generate summary</button>
        </div>
      </Panel>
      <Panel title="File notes and actions">
        <div className="space-y-3">
          {transcripts.map((item) => (
            <article className="rounded-lg border border-white/10 bg-[#0d1f38] p-4" key={item.id}>
              <div className="font-medium">{item.client}</div>
              <p className="mt-2 text-sm text-[#8eaecb]">{item.summary}</p>
              <ul className="mt-3 space-y-1 text-xs text-[#8eaecb]">
                {item.actions.map((action) => <li className="flex gap-2" key={action}><CheckCircle2 size={14} className="text-[#3eb87a]" />{action}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function SearchView({ query, setQuery, results }: { query: string; setQuery: (value: string) => void; results: { type: string; title: string; body: string }[] }) {
  return (
    <Panel title="Natural language search">
      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-[#4a6a85]" size={18} />
        <input className="form-field pl-12" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search clients, uploaded files, reminders, drafts, and transcripts" />
      </div>
      <div className="mt-5 space-y-3">
        {query && results.length === 0 && <div className="rounded-lg border border-white/10 bg-[#0d1f38] p-4 text-sm text-[#8eaecb]">No records found.</div>}
        {results.map((item, index) => (
          <article className="rounded-lg border border-white/10 bg-[#0d1f38] p-4" key={`${item.type}-${index}`}>
            <div className="flex items-center gap-2"><Badge tone="blue">{item.type}</Badge><span className="font-medium">{item.title}</span></div>
            <p className="mt-2 text-sm text-[#8eaecb]">{item.body}</p>
          </article>
        ))}
      </div>
    </Panel>
  );
}

function AnalyticsView({ stats, documents, drafts, reminders, transcripts }: { stats: { label: string; value: number | string; color: string; note: string }[]; documents: DocumentRecord[]; drafts: Draft[]; reminders: Reminder[]; transcripts: Transcript[] }) {
  const bars = [
    { label: "OCR", value: documents.length * 2 },
    { label: "Draft", value: drafts.length * 3 },
    { label: "Remind", value: reminders.length },
    { label: "Calls", value: transcripts.length }
  ];
  const max = Math.max(1, ...bars.map((bar) => bar.value));

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => <MiniModule key={stat.label} icon={<BarChart3 />} title={stat.label} value={`${stat.value} - ${stat.note}`} onClick={() => undefined} />)}
      </div>
      <Panel title="Productivity by feature">
        <div className="flex h-56 items-end gap-4">
          {bars.map((bar) => (
            <div className="flex flex-1 flex-col items-center gap-2" key={bar.label}>
              <div className="text-xs text-[#8eaecb]">{bar.value}h</div>
              <div className="w-full rounded-t-md bg-[#c9a84c]" style={{ height: `${Math.max(12, (bar.value / max) * 170)}px`, opacity: 0.45 + bar.value / max / 2 }} />
              <div className="text-xs text-[#4a6a85]">{bar.label}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function SettingsView({ notify }: { notify: (message: string) => void }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Panel title="Firm settings">
        <form className="space-y-3" onSubmit={(event) => { event.preventDefault(); notify("Settings saved"); }}>
          <input className="form-field" defaultValue="FlowOps Legal Workspace" />
          <input className="form-field" defaultValue="admin@flowops.local" />
          <select className="form-field" defaultValue="Legal"><option>Legal</option><option>Migration</option><option>Accounting</option><option>Medical Admin</option></select>
          <button className="rounded-md bg-[#c9a84c] px-4 py-3 text-sm font-medium text-[#060e1c]">Save changes</button>
        </form>
      </Panel>
      <Panel title="Notification channels">
        <div className="space-y-3">
          {["Email reminders", "SMS reminders", "WhatsApp alerts", "In-app notifications"].map((item, index) => (
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-[#0d1f38] p-4" key={item}>
              <span>{item}</span>
              <Badge tone={index === 2 ? "gold" : "green"}>{index === 2 ? "Mock mode" : "Active"}</Badge>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function ClientModal({ close, setClients, notify }: { close: () => void; setClients: (updater: (items: Client[]) => Client[]) => void; notify: (message: string) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const client: Client = {
      id: id("c"),
      name: String(data.get("name") || "New Client"),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      matter: String(data.get("matter") || "General"),
      status: "Active",
      priority: String(data.get("priority") || "Medium") as Client["priority"],
      notes: String(data.get("notes") || ""),
      createdAt: "Just now"
    };
    setClients((items) => [client, ...items]);
    close();
    notify("Client added");
  }

  return <Modal title="Add client" close={close}><form className="space-y-3" onSubmit={submit}><input name="name" className="form-field" placeholder="Client name" required /><input name="email" className="form-field" placeholder="Email" /><input name="phone" className="form-field" placeholder="Phone" /><select name="matter" className="form-field"><option>Personal Injury</option><option>Migration</option><option>Family Law</option><option>Commercial</option><option>Medical Admin</option></select><select name="priority" className="form-field"><option>High</option><option>Medium</option><option>Low</option></select><textarea name="notes" className="form-field" placeholder="Notes" /><SubmitRow close={close} label="Add client" /></form></Modal>;
}

function ReminderModal({ close, clients, setReminders, notify }: { close: () => void; clients: Client[]; setReminders: (updater: (items: Reminder[]) => Reminder[]) => void; notify: (message: string) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setReminders((items) => [{
      id: id("r"),
      title: String(data.get("title") || "Follow up"),
      client: String(data.get("client") || "Unassigned"),
      channel: String(data.get("channel") || "Email"),
      due: String(data.get("due") || today),
      status: "Pending"
    }, ...items]);
    close();
    notify("Reminder scheduled");
  }

  return <Modal title="Add reminder" close={close}><form className="space-y-3" onSubmit={submit}><input name="title" className="form-field" placeholder="Reminder title" required /><select name="client" className="form-field">{clients.map((client) => <option key={client.id}>{client.name}</option>)}</select><input name="due" className="form-field" type="date" defaultValue={today} /><select name="channel" className="form-field"><option>Email</option><option>SMS</option><option>Email + SMS</option><option>WhatsApp</option></select><SubmitRow close={close} label="Schedule" /></form></Modal>;
}

function TeamModal({ close, setTeam, notify }: { close: () => void; setTeam: (updater: (items: TeamMember[]) => TeamMember[]) => void; notify: (message: string) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setTeam((items) => [{ id: id("u"), name: String(data.get("name") || "Team Member"), role: String(data.get("role") || "Staff"), access: String(data.get("access") || "Viewer") }, ...items]);
    close();
    notify("Team member added");
  }

  return <Modal title="Add team member" close={close}><form className="space-y-3" onSubmit={submit}><input name="name" className="form-field" placeholder="Name" required /><input name="role" className="form-field" placeholder="Role" /><select name="access" className="form-field"><option>Admin</option><option>Editor</option><option>Viewer</option></select><SubmitRow close={close} label="Add user" /></form></Modal>;
}

function Modal({ title, close, children }: { title: string; close: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#0a1628] p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold">{title}</h2>
          <button className="rounded-md border border-white/10 p-2 text-[#8eaecb]" onClick={close}><X size={16} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function SubmitRow({ close, label }: { close: () => void; label: string }) {
  return <div className="flex justify-end gap-2 pt-2"><button type="button" className="rounded-md border border-white/10 px-4 py-2 text-sm text-[#8eaecb]" onClick={close}>Cancel</button><button className="rounded-md bg-[#c9a84c] px-4 py-2 text-sm font-medium text-[#060e1c]">{label}</button></div>;
}

function ResponsiveTable({ headers, children }: { headers: string[]; children: ReactNode }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="text-[10px] uppercase tracking-[0.14em] text-[#4a6a85]"><tr>{headers.map((header) => <th className="pb-3" key={header}>{header}</th>)}</tr></thead><tbody>{children}</tbody></table></div>;
}

function Badge({ tone, children }: { tone: "green" | "red" | "gold" | "blue"; children: ReactNode }) {
  const tones = {
    green: "bg-[#3eb87a]/10 text-[#3eb87a]",
    red: "bg-[#e05555]/10 text-[#e05555]",
    gold: "bg-[#c9a84c]/10 text-[#c9a84c]",
    blue: "bg-[#4a8fe8]/10 text-[#4a8fe8]"
  };
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

function Toast({ message }: { message: string }) {
  if (!message) return null;
  return <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl border border-[#3eb87a] bg-[#0a1628] px-4 py-3 text-sm shadow-2xl"><CheckCircle2 className="text-[#3eb87a]" size={18} />{message}</div>;
}
