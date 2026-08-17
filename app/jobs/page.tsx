"use client";

import { useState } from "react";
import Link from "next/link";

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

const TYPES = ["Full-time", "Contract", "Remote"];
const EMPTY_FORM = {
  title: "",
  department: "",
  location: "",
  type: TYPES[0],
  description: "",
};
const inputClass =
  "rounded-sm border-2 border-ink bg-panel px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-rust";

const OPEN_ROLES: Job[] = [
  {
    id: 1,
    title: "Frontend Engineer",
    department: "Engineering",
    location: "Bengaluru",
    type: "Full-time",
    description:
      "Build and ship the candidate and hiring dashboards using React and Next.js, working closely with design to keep the interface fast and accessible.",
  },
  {
    id: 2,
    title: "Backend Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description:
      "Design and maintain the APIs that power our applicant tracking system, including search, scoring, and integrations with external job boards.",
  },
  {
    id: 3,
    title: "Product Designer",
    department: "Design",
    location: "Hybrid",
    type: "Full-time",
    description:
      "Own the end-to-end design of our recruiter and candidate experiences, from early wireframes to polished, tested interfaces.",
  },
  {
    id: 4,
    title: "Data Analyst",
    department: "Operations",
    location: "Bengaluru",
    type: "Contract",
    description:
      "Track hiring funnel metrics and build reports that help recruiters and hiring managers understand where candidates drop off.",
  },
  {
    id: 5,
    title: "Talent Sourcer",
    department: "Sales",
    location: "Remote",
    type: "Contract",
    description:
      "Proactively reach out to passive candidates for open engineering and design roles and keep our pipeline full of strong applicants.",
  },
  {
    id: 6,
    title: "Customer Success Associate",
    department: "Support",
    location: "Pune",
    type: "Full-time",
    description:
      "Help recruiting teams get the most out of the platform, from onboarding through renewal.",
  },
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(OPEN_ROLES);
  const [form, setForm] = useState(EMPTY_FORM);

  function addJob(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.department.trim()) return;

    setJobs((prev) => [...prev, { id: Date.now(), ...form }]);
    setForm(EMPTY_FORM);
  }

  function deleteJob(id: number) {
    setJobs((prev) => prev.filter((j) => j.id !== id));
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
            <Link href="/candidates" className="text-ink">
              Candidates
            </Link>
            <Link href="/jobs" className="text-rust">
              Open Roles
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6">
        <form onSubmit={addJob}>
          <fieldset className="border-2 border-ink bg-paper p-4 sm:p-6">
            <legend className="font-display px-2 text-base font-semibold">
              Post an open role
            </legend>
            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Role title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Department"
                value={form.department}
                onChange={(e) =>
                  setForm({ ...form, department: e.target.value })
                }
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Location"
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
                className={inputClass}
              />
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className={inputClass}
              >
                {TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <textarea
                placeholder="Role description"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className={`${inputClass} sm:col-span-2 resize-y`}
              />
              <button
                type="submit"
                className="bg-rust px-4 py-2 text-sm font-semibold text-paper sm:col-span-2"
              >
                Post role
              </button>
            </div>
          </fieldset>
        </form>

        <div>
          <h2 className="font-display mb-3 text-lg font-semibold">
            Open roles ({jobs.length})
          </h2>

          <ul className="space-y-3">
            {jobs.map((j) => (
              <li key={j.id} className="border-2 border-ink bg-panel p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-medium">{j.title}</p>
                    <p className="text-sm text-muted">
                      {j.department}, {j.location}, {j.type}
                    </p>
                    <p className="mt-2 text-sm">{j.description}</p>
                  </div>
                  <button
                    onClick={() => deleteJob(j.id)}
                    className="shrink-0 border-2 border-rust px-3 py-1 text-sm font-semibold text-rust"
                  >
                    Close role
                  </button>
                </div>
              </li>
            ))}

            {jobs.length === 0 && (
              <li className="border-2 border-dashed border-ink p-6 text-center text-sm text-muted">
                No open roles yet.
              </li>
            )}
          </ul>
        </div>
      </div>
    </main>
  );
}
