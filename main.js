const STATUS_STYLES = {
  Released: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  Merged: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  "In Review": "bg-sky-500/15 text-sky-300 ring-sky-500/30",
  Building: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
  Planning: "bg-violet-500/15 text-violet-300 ring-violet-500/30",
  Todo: "bg-slate-500/15 text-slate-300 ring-slate-500/30",
  Draft: "bg-zinc-500/15 text-zinc-400 ring-zinc-500/30",
};

const DONE_STATUSES = new Set(["Released", "Merged"]);

function statusBadgeClass(status) {
  return (
    STATUS_STYLES[status] ||
    "bg-slate-500/15 text-slate-300 ring-slate-500/30"
  );
}

function renderEpic(epic) {
  const el = document.getElementById("epic");
  el.removeAttribute("aria-busy");
  el.innerHTML = `
    <div class="flex flex-wrap items-center gap-3">
      <span class="rounded-md bg-slate-800 px-2 py-0.5 font-mono text-xs text-slate-300">
        ${epic.id}
      </span>
      <span class="rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusBadgeClass(
        epic.status,
      )}">${epic.status}</span>
    </div>
    <h2 class="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
      ${epic.title}
    </h2>
    ${
      epic.description
        ? `<p class="mt-3 text-slate-400">${epic.description}</p>`
        : ""
    }
  `;
}

function renderProgress(sessions) {
  const totalWeight = sessions.reduce((s, x) => s + (x.weight || 0), 0) || 0;
  const doneWeight = sessions
    .filter((x) => DONE_STATUSES.has(x.status))
    .reduce((s, x) => s + (x.weight || 0), 0);
  const pct = totalWeight === 0 ? 0 : Math.round((doneWeight / totalWeight) * 100);
  const bar = document.getElementById("progress-bar");
  bar.style.width = `${pct}%`;
  const label = document.getElementById("progress-label");
  label.textContent = `${doneWeight} / ${totalWeight} points · ${pct}%`;
  document.getElementById("progress").removeAttribute("aria-busy");
}

function renderSessions(sessions) {
  const el = document.getElementById("sessions");
  el.removeAttribute("aria-busy");
  if (!sessions.length) {
    el.innerHTML = `<p class="text-sm text-slate-500 sm:col-span-2">No sessions yet.</p>`;
    return;
  }
  el.innerHTML = sessions
    .map(
      (s) => `
      <article class="rounded-xl border border-slate-800 bg-slate-900/50 p-5 transition hover:border-slate-700 hover:bg-slate-900">
        <div class="flex items-center justify-between gap-3">
          <span class="rounded-md bg-slate-800 px-2 py-0.5 font-mono text-xs text-slate-300">
            ${s.id}
          </span>
          <span class="rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusBadgeClass(
            s.status,
          )}">${s.status}</span>
        </div>
        <h3 class="mt-3 text-lg font-semibold text-slate-100">
          ${s.name}
        </h3>
        <p class="mt-3 text-xs uppercase tracking-wider text-slate-500">
          Weight · ${s.weight ?? 0}
        </p>
      </article>`,
    )
    .join("");
}

function renderError(message) {
  const el = document.getElementById("sessions");
  el.removeAttribute("aria-busy");
  el.innerHTML = `
    <p class="text-sm text-rose-400 sm:col-span-2">
      Failed to load content: ${message}
    </p>`;
}

async function main() {
  try {
    const res = await fetch("./content.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    renderEpic(data.epic);
    renderSessions(data.sessions || []);
    renderProgress(data.sessions || []);
  } catch (err) {
    renderError(err.message || String(err));
  }
}

document.addEventListener("DOMContentLoaded", main);
