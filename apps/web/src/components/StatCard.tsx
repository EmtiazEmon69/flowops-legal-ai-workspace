type StatCardProps = {
  label: string;
  value: string;
  trend: string;
};

export function StatCard({ label, value, trend }: StatCardProps) {
  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-600">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <strong className="text-3xl font-semibold text-ink">{value}</strong>
        <span className="text-sm text-teal">{trend}</span>
      </div>
    </section>
  );
}

