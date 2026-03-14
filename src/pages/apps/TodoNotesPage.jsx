import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Plus, StickyNote, Trash2 } from "lucide-react";

const TODO_KEY = "npl.todo.notes.tasks";
const NOTE_KEY = "npl.todo.notes.quicknote";

export default function TodoNotesPage() {
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [quickNote, setQuickNote] = useState("");

  useEffect(() => {
    const savedTasks = localStorage.getItem(TODO_KEY);
    const savedNote = localStorage.getItem(NOTE_KEY);

    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch {
        setTasks([]);
      }
    }

    if (savedNote) setQuickNote(savedNote);
  }, []);

  useEffect(() => {
    localStorage.setItem(TODO_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(NOTE_KEY, quickNote);
  }, [quickNote]);

  const completedCount = useMemo(() => tasks.filter((item) => item.done).length, [tasks]);

  const addTask = () => {
    const text = taskInput.trim();
    if (!text) return;

    setTasks((prev) => [
      {
        id: Date.now(),
        text,
        done: false,
      },
      ...prev,
    ]);
    setTaskInput("");
  };

  const toggleTask = (id) => {
    setTasks((prev) => prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
  };

  const removeTask = (id) => {
    setTasks((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gray-100 p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">To-Do Notes</h1>
          <p className="mt-1 text-sm text-gray-500">Track pending actions and keep quick personal notes.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr,360px]">
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-gray-900">Task List</h2>
              <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                {completedCount}/{tasks.length} Completed
              </span>
            </div>

            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                placeholder="Add a new task"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={addTask}
                className="inline-flex items-center gap-1 rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-700"
              >
                <Plus size={16} /> Add
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {tasks.length ? (
                tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
                    <button
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      className="flex items-center gap-2 text-left"
                    >
                      <CheckCircle2
                        size={18}
                        className={task.done ? "text-green-600" : "text-gray-300"}
                      />
                      <span className={`text-sm ${task.done ? "text-gray-500 line-through" : "text-gray-800"}`}>
                        {task.text}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => removeTask(task.id)}
                      className="rounded p-1 text-red-500 hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No tasks yet.</p>
              )}
            </div>
          </section>

          <aside className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <StickyNote size={18} className="text-primary-700" />
              <h2 className="text-lg font-semibold text-gray-900">Quick Notes</h2>
            </div>
            <p className="mt-1 text-xs text-gray-500">Saved automatically in your browser.</p>

            <textarea
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
              placeholder="Write meeting points, reminders, and follow-ups..."
              rows={16}
              className="mt-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
