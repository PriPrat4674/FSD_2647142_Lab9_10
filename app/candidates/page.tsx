"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Candidate {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const API = "https://jsonplaceholder.typicode.com/users";
const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "UI/UX Designer",
  "Data Analyst",
  "Product Manager",
  "QA Engineer",
];
const STATUSES = ["Applied", "Interviewing", "Offer", "Rejected"];
const EMPTY_FORM = { name: "", email: "", role: "", status: STATUSES[0] };
const inputClass =
  "rounded-sm border-2 border-ink bg-panel px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-rust";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const res = await fetch(API);
    const users: { id: number; name: string; email: string }[] =
      await res.json();
    setCandidates(
      users.slice(0, 6).map((u, i) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: ROLES[i % ROLES.length],
        status: STATUSES[i % STATUSES.length],
      })),
    );
    setLoading(false);
  }

  async function addCandidate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.role.trim()) return;

    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const created = await res.json();

    setCandidates((prev) => [
      ...prev,
      { id: created.id ?? Date.now(), ...form },
    ]);
    setForm(EMPTY_FORM);
  }

  async function updateStatus(id: number, status: string) {
    await fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c)),
    );
  }

  async function deleteCandidate(id: number) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    setCandidates((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <main className="min-h-screen bg-paper">
      <header className="border-b-2 border-ink bg-paper">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-5 sm:px-6">
          <div>
            <p className="font-display text-lg font-bold sm:text-xl">
              RecruitmentHub
            </p>
            <p className="text-sm text-muted">Candidate and role tracker</p>
          </div>
          <nav className="flex gap-5 text-sm font-semibold">
            <Link href="/candidates" className="text-rust">
              Candidates
            </Link>
            <Link href="/jobs" className="text-ink">
              Open Roles
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6">
        <form onSubmit={addCandidate}>
          <fieldset className="border-2 border-ink bg-paper p-4 sm:p-6">
            <legend className="font-display px-2 text-base font-semibold">
              Add a candidate
            </legend>
            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Role applied for"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className={inputClass}
              />
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className={inputClass}
              >
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-rust px-4 py-2 text-sm font-semibold text-paper sm:col-span-2"
              >
                Add candidate
              </button>
            </div>
          </fieldset>
        </form>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">
              Candidates ({candidates.length})
            </h2>
            <button
              onClick={load}
              disabled={loading}
              className="text-sm font-semibold text-rust disabled:opacity-50"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {loading && candidates.length === 0 && (
            <p className="border-2 border-dashed border-ink p-6 text-center text-sm text-muted">
              Loading candidates...
            </p>
          )}

          <ul className="space-y-3">
            {candidates.map((c) => (
              <li
                key={c.id}
                className="flex flex-col gap-3 border-2 border-ink bg-panel p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-sm text-muted">{c.email}</p>
                  <p className="text-sm text-muted">{c.role}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={c.status}
                    onChange={(e) => updateStatus(c.id, e.target.value)}
                    className="rounded-sm border-2 border-ink bg-paper px-2 py-1 text-sm"
                  >
                    {STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => deleteCandidate(c.id)}
                    className="border-2 border-rust px-3 py-1 text-sm font-semibold text-rust"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}

            {!loading && candidates.length === 0 && (
              <li className="border-2 border-dashed border-ink p-6 text-center text-sm text-muted">
                No candidates yet.
              </li>
            )}
          </ul>
        </div>
      </div>
    </main>
  );
}
