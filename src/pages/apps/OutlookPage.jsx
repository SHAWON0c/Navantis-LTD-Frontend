import { useMemo, useState } from "react";
import { Inbox, Mail, Search, Send, Star } from "lucide-react";

const inboxSeed = [
  {
    id: 1,
    from: "HR Team",
    subject: "Updated Leave Policy",
    preview: "Please review the attached leave policy updates for Q2.",
    time: "09:10 AM",
    body: "Hi Team,\n\nWe have updated the leave policy for Q2. Please review the points and contact HR if you have questions.\n\nRegards,\nHR Team",
  },
  {
    id: 2,
    from: "Finance",
    subject: "Monthly Expense Reminder",
    preview: "Submit your expense claims before 25th of this month.",
    time: "Yesterday",
    body: "Dear Team,\n\nPlease submit all expense claims before the 25th to avoid delays in reimbursement.\n\nThanks,\nFinance",
  },
  {
    id: 3,
    from: "Operations",
    subject: "Dispatch Timing Change",
    preview: "Dispatch timing for Zone-B has changed from Monday.",
    time: "Mon",
    body: "Hello,\n\nDispatch timing for Zone-B has shifted to 8:00 AM starting Monday due to route changes.\n\nOperations",
  },
];

export default function OutlookPage() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(inboxSeed[0]?.id || null);

  const filteredMails = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return inboxSeed;
    return inboxSeed.filter(
      (mail) =>
        mail.from.toLowerCase().includes(q) ||
        mail.subject.toLowerCase().includes(q) ||
        mail.preview.toLowerCase().includes(q)
    );
  }, [search]);

  const selectedMail = filteredMails.find((item) => item.id === selectedId) || filteredMails[0] || null;

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gray-100 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">Outlook</h1>
          <p className="mt-1 text-sm text-gray-500">Review company communication in one place.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px,1fr]">
          <aside className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <button
              type="button"
              className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              <Send size={15} /> Compose
            </button>

            <div className="space-y-1 text-sm">
              <p className="flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2 font-semibold text-blue-700">
                <Inbox size={15} /> Inbox
              </p>
              <p className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100">
                <Star size={15} /> Starred
              </p>
              <p className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100">
                <Mail size={15} /> Sent
              </p>
            </div>

            <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2 top-2.5 text-gray-400" size={14} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search mail"
                  className="w-full rounded-md border border-gray-300 bg-white py-1.5 pl-7 pr-2 text-xs"
                />
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {filteredMails.map((mail) => (
                <button
                  key={mail.id}
                  type="button"
                  onClick={() => setSelectedId(mail.id)}
                  className={`w-full rounded-md border px-3 py-2 text-left ${
                    selectedMail?.id === mail.id
                      ? "border-primary-200 bg-primary-50"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-gray-800">{mail.from}</p>
                    <span className="text-[11px] text-gray-500">{mail.time}</span>
                  </div>
                  <p className="mt-1 truncate text-xs font-medium text-gray-700">{mail.subject}</p>
                  <p className="truncate text-xs text-gray-500">{mail.preview}</p>
                </button>
              ))}

              {!filteredMails.length && <p className="text-sm text-gray-500">No matching messages found.</p>}
            </div>
          </aside>

          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            {selectedMail ? (
              <>
                <div className="border-b border-gray-200 pb-3">
                  <h2 className="text-xl font-semibold text-gray-900">{selectedMail.subject}</h2>
                  <p className="mt-1 text-sm text-gray-600">From: {selectedMail.from}</p>
                  <p className="text-xs text-gray-500">{selectedMail.time}</p>
                </div>
                <div className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-700">{selectedMail.body}</div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-500">
                Select an email to see details.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
