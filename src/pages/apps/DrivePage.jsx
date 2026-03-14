import { useMemo, useState } from "react";
import { FileText, FileUp, Folder, Search, Star, Trash2 } from "lucide-react";

const folderSeed = [
  { id: 1, name: "Finance Reports", files: 12, owner: "Finance" },
  { id: 2, name: "HR Documents", files: 8, owner: "HR" },
  { id: 3, name: "Sales Presentations", files: 19, owner: "Sales" },
  { id: 4, name: "Warehouse SOP", files: 6, owner: "Warehouse" },
];

const recentFilesSeed = [
  { id: 101, name: "Monthly-Stock-Summary.xlsx", size: "1.4 MB", updated: "2h ago" },
  { id: 102, name: "Q1-Target-Review.pptx", size: "4.8 MB", updated: "Yesterday" },
  { id: 103, name: "Policy-Revision-Leave.docx", size: "0.6 MB", updated: "2 days ago" },
];

export default function DrivePage() {
  const [search, setSearch] = useState("");
  const [starred, setStarred] = useState({});

  const filteredFolders = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return folderSeed;
    return folderSeed.filter((folder) => folder.name.toLowerCase().includes(q));
  }, [search]);

  const toggleStar = (id) => {
    setStarred((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gray-100 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Drive</h1>
              <p className="mt-1 text-sm text-gray-500">Browse team folders and recently updated files.</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              <FileUp size={15} /> Upload
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="relative max-w-lg">
            <Search className="pointer-events-none absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search folders"
              className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr,360px]">
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">Team Folders</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {filteredFolders.map((folder) => (
                <article key={folder.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                        <Folder size={16} className="text-amber-500" />
                        {folder.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-600">Owner: {folder.owner}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleStar(folder.id)}
                      className="rounded p-1 hover:bg-gray-200"
                    >
                      <Star size={15} className={starred[folder.id] ? "fill-yellow-400 text-yellow-500" : "text-gray-400"} />
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-600">{folder.files} files</p>
                </article>
              ))}
            </div>
          </section>

          <aside className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">Recent Files</h2>
            <div className="space-y-2">
              {recentFilesSeed.map((file) => (
                <div key={file.id} className="rounded-md border border-gray-200 bg-gray-50 p-3">
                  <p className="flex items-center gap-2 text-sm font-medium text-gray-800">
                    <FileText size={15} className="text-blue-600" /> {file.name}
                  </p>
                  <div className="mt-1 flex items-center justify-between text-xs text-gray-600">
                    <span>{file.size}</span>
                    <span>{file.updated}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="mt-4 inline-flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
            >
              <Trash2 size={14} /> Empty Trash
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
