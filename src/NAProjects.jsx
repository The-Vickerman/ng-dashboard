import { useState, useMemo, Fragment } from "react";

const AS_OF = "June 16, 2026";
const TODAY = new Date("2026-06-16");

const PROJECTS = [
  { id:"02723661", customer:"Lincoln Electric", na:"Aline Ventura", impl:"Global — TL, LTL, Parcel, Air, Ocean + Tracy, OT", kickoff:"2026-02-27", estClose:"2026-07-31", pct:0, carriers:152, modes:["TL","LTL","Parcel","Air","Ocean","Tracy","OT"], funnel:{total:155,invited:144,responded:60,onboarded:3,blocked:38}, blockers:5, funnelStatus:"live" },
  { id:"02601407", customer:"Topco", na:"Aline Ventura", impl:"N. America — TMS Migration", kickoff:"2025-09-05", estClose:"2026-05-22", pct:33, carriers:0, modes:["TMS"], funnel:null, blockers:0, funnelStatus:"pending" },
  { id:"02314334", customer:"Arrow Electronics", na:"Aline Ventura", impl:"N. America — Parcel, Air, LTL, Ocean, TL", kickoff:"2024-12-10", estClose:"2026-04-17", pct:33, carriers:13, modes:["TL","LTL","Parcel","Air","Ocean"], funnel:null, blockers:0, funnelStatus:"pending" },
  { id:"02637860", customer:"AWS Cloud Logistics", na:"Daisy Marquez", impl:"Global — TL, LTL, Parcel, Air, Ocean", kickoff:"2025-11-06", estClose:"2026-06-05", pct:0, carriers:0, modes:["TL","LTL","Parcel","Air","Ocean"], funnel:null, blockers:0, funnelStatus:"pending" },
  { id:"02590130", customer:"Unilever", na:"Daisy Marquez", impl:"Polly Impl — N. America — TL & LTL", kickoff:"2025-09-15", estClose:"2026-05-01", pct:67, carriers:0, modes:["TL","LTL","Polly"], funnel:null, blockers:0, funnelStatus:"pending" },
  { id:"02869493", customer:"Grocery Outlet", na:"Jevon Jackson", impl:"N. America — LRC and FourSight", kickoff:"2026-06-10", estClose:"2026-08-28", pct:0, carriers:0, modes:["LRC","FourSight"], funnel:null, blockers:0, funnelStatus:"pending" },
  { id:"02793886", customer:"Vantive", na:"Jevon Jackson", impl:"US — TL, LTL", kickoff:"2026-05-20", estClose:"2026-08-28", pct:0, carriers:0, modes:["TL","LTL"], funnel:null, blockers:0, funnelStatus:"pending" },
  { id:"02697184", customer:"James Hardie", na:"Jevon Jackson", impl:"eDocs — N. America — TL", kickoff:"2026-01-13", estClose:"2026-07-31", pct:0, carriers:0, modes:["TL","eDocs"], funnel:null, blockers:0, funnelStatus:"pending" },
  { id:"02628285", customer:"Estée Lauder", na:"Jevon Jackson", impl:"NORTAM/EMEA/APAC — Air, Ocean, TL, LTL, Rail, OT", kickoff:"2025-11-06", estClose:"2026-08-31", pct:0, carriers:36, modes:["Air","Ocean","TL","LTL","Rail","OT","SAM","TRACY"], funnel:{total:36,invited:36,responded:16,onboarded:3,blocked:11}, blockers:3, funnelStatus:"live" },
  { id:"02618299", customer:"Harbor Freight Tools", na:"Jevon Jackson", impl:"N. America — TL, Mobile Retail App", kickoff:"2025-10-28", estClose:"2026-08-28", pct:0, carriers:0, modes:["TL","Mobile"], funnel:null, blockers:0, funnelStatus:"pending" },
  { id:"02663843", customer:"Walmart International", na:"Johnny Mei", impl:"Global — Ocean ICT Supplier Connect", kickoff:"2025-12-19", estClose:"2026-07-10", pct:42, carriers:3, modes:["Ocean","ICT"], funnel:null, blockers:0, funnelStatus:"pending" },
  { id:"02628418", customer:"3M Company", na:"Johnny Mei", impl:"World — TL, LTL, Parcel, Rail, Ocean, Air", kickoff:"2025-12-04", estClose:"2026-10-14", pct:0, carriers:0, modes:["TL","LTL","Parcel","Rail","Ocean","Air"], funnel:null, blockers:0, funnelStatus:"pending" },
  { id:"02584212", customer:"Tyson", na:"Johnny Mei", impl:"Order, Ocean, Rail, Air Upsell", kickoff:"2025-08-12", estClose:"2026-06-26", pct:67, carriers:14, modes:["Ocean","Rail","Air","OT"], funnel:null, blockers:0, funnelStatus:"pending" },
  { id:"01827962", customer:"K.L. Breeden & Sons", na:"Katharina Giuliani", impl:"N. America — TL", kickoff:"2024-01-30", estClose:"2026-02-27", pct:75, carriers:1, modes:["TL"], funnel:null, blockers:0, funnelStatus:"pending" },
  { id:"01592516", customer:"CHS Inc", na:"Katharina Giuliani", impl:"N. America — TL, LTL, Rail, Ocean, Barge", kickoff:"2023-11-03", estClose:"2026-06-30", pct:20, carriers:0, modes:["TL","LTL","Rail","Ocean"], funnel:null, blockers:0, funnelStatus:"pending" },
  { id:"02758433", customer:"DHL Supply Chain", na:"Krishnasharmila R", impl:"Harley Davidson — Ocean, Air, Rail", kickoff:"2026-05-20", estClose:"2026-08-21", pct:0, carriers:15, modes:["Ocean","Air","Rail"], funnel:null, blockers:0, funnelStatus:"pending" },
  { id:"02019294", customer:"Medtronic", na:"Kristen Whitman", impl:"N. America — TL, LTL, Air, Ocean", kickoff:"2024-04-09", estClose:"2026-06-30", pct:78, carriers:50, modes:["TL","LTL","Air","Ocean"], funnel:null, blockers:0, funnelStatus:"pending" },
  { id:"02695791", customer:"Bridgestone Americas", na:"Kristina Quirouette", impl:"Agent Upsell — N. America — OV, SAM, Tracy", kickoff:"2026-02-04", estClose:"2026-07-31", pct:33, carriers:0, modes:["OV","SAM","TRACY"], funnel:null, blockers:0, funnelStatus:"pending" },
  { id:"02825900", customer:"Scania Outbound", na:"Manoj Kumar Singh", impl:"EMEA/LATAM — TL, RoRo, Ocean, Short Sea", kickoff:null, estClose:null, pct:0, carriers:0, modes:["TL","Ocean"], funnel:null, blockers:0, funnelStatus:"pending" },
  { id:"02668494", customer:"Scania Inbound", na:"Manoj Kumar Singh", impl:"EMEA — TL & Intermodal", kickoff:"2026-01-07", estClose:"2026-08-20", pct:13, carriers:29, modes:["TL","Rail","Ocean"], funnel:null, blockers:0, funnelStatus:"pending" },
  { id:"01860112", customer:"Volvo Group", na:"Manoj Kumar Singh", impl:"Europe — TL, Ocean, Rail", kickoff:"2024-03-05", estClose:"2026-07-30", pct:52, carriers:50, modes:["TL","Ocean","Rail"], funnel:null, blockers:0, funnelStatus:"pending" },
  { id:"02752430", customer:"HNI Corporation", na:"Manuel Gomez", impl:"N. America — TL, LTL", kickoff:"2026-04-27", estClose:"2026-07-10", pct:0, carriers:0, modes:["TL","LTL"], funnel:null, blockers:0, funnelStatus:"pending" },
  { id:"02695666", customer:"Trane Technologies", na:"Mariana Freitas", impl:"N. America — TMS Migration", kickoff:null, estClose:"2026-10-30", pct:0, carriers:0, modes:["TMS"], funnel:null, blockers:0, funnelStatus:"pending" },
  { id:"02624198", customer:"Frio Express", na:"Mariana Freitas", impl:"N. America — TL (Temp, LRC, Secure + Tracy/Cassie)", kickoff:"2025-11-07", estClose:"2026-07-10", pct:44, carriers:4, modes:["TL","Tracy","Cassie"], funnel:null, blockers:0, funnelStatus:"pending" },
  { id:"02612662", customer:"Kraft Heinz Brazil", na:"Mariana Freitas", impl:"OTM Integration — TL, LTL", kickoff:"2025-10-06", estClose:"2026-04-10", pct:100, carriers:15, modes:["TL","LTL"], funnel:null, blockers:0, funnelStatus:"pending" },
  { id:"02569656", customer:"West Pharmaceutical", na:"Mariana Freitas", impl:"N. America, EMEA, APAC — Ocean, Air, TL", kickoff:"2025-09-24", estClose:"2026-07-31", pct:0, carriers:36, modes:["Ocean","Air","TL"], funnel:null, blockers:0, funnelStatus:"pending" },
  { id:"02752718", customer:"Martin Brower", na:"Nathalie Lesmes", impl:"N. America — Temp Tracking Upsell", kickoff:"2026-03-27", estClose:"2026-06-29", pct:0, carriers:0, modes:["TL"], funnel:null, blockers:0, funnelStatus:"pending" },
  { id:"02274627", customer:"Atkore Europe", na:"Nathalie Lesmes", impl:"TL, LTL", kickoff:"2024-11-04", estClose:"2026-07-17", pct:100, carriers:11, modes:["TL","LTL"], funnel:null, blockers:0, funnelStatus:"pending" },
  { id:"02722634", customer:"Western Digital", na:"Nia Gillenwater", impl:"USA/Canada/Europe/APAC — Air, Ocean, TL, LTL, Parcel", kickoff:"2026-02-17", estClose:"2026-09-25", pct:8, carriers:19, modes:["Air","Ocean","TL","LTL","Parcel"], funnel:null, blockers:0, funnelStatus:"pending" },
  { id:"02532731", customer:"Phibro Animal Health", na:"Nia Gillenwater", impl:"TL, LTL, Ocean, Rail + Tracy AI", kickoff:"2025-07-24", estClose:"2026-06-17", pct:42, carriers:18, modes:["TL","LTL","Ocean","Rail","Tracy"], funnel:null, blockers:0, funnelStatus:"pending" },
  { id:"02433026", customer:"Mary Kay", na:"Nia Gillenwater", impl:"N. America — TL, LTL, Ocean, Air", kickoff:"2025-09-15", estClose:"2026-07-03", pct:24, carriers:23, modes:["TL","LTL","Ocean","Air"], funnel:null, blockers:0, funnelStatus:"pending" },
  { id:"02516042", customer:"Conagra", na:"Roheaz Furquan", impl:"—", kickoff:null, estClose:"2025-06-27", pct:0, carriers:0, modes:[], funnel:null, blockers:0, funnelStatus:"pending" },
  { id:"02498694", customer:"Sazerac", na:"Prathiba Seetharaman", impl:"—", kickoff:null, estClose:"2025-06-04", pct:0, carriers:0, modes:[], funnel:null, blockers:0, funnelStatus:"pending" },
];

function weeksElapsed(kickoff) {
  if (!kickoff) return null;
  return Math.floor((TODAY - new Date(kickoff)) / (7 * 24 * 3600 * 1000));
}

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" });
}

function healthLabel(p) {
  if (p.pct === 100) return { label: "Complete", color: "#4c4" };
  const close = p.estClose ? new Date(p.estClose) : null;
  if (close && close < TODAY) return { label: "Overdue", color: "#e55" };
  if (!p.kickoff) return { label: "No dates", color: "#8b949e" };
  if (p.blockers >= 3) return { label: `${p.blockers} blockers`, color: "#e55" };
  if (p.blockers > 0) return { label: `${p.blockers} blocker${p.blockers > 1 ? "s" : ""}`, color: "#fa0" };
  const wks = weeksElapsed(p.kickoff);
  if (p.pct === 0 && wks && wks > 20) return { label: "Stalled?", color: "#fa0" };
  if (p.pct >= 67) return { label: "On track", color: "#4c4" };
  return { label: "In progress", color: "#58a6ff" };
}

function FunnelBar({ funnel }) {
  if (!funnel) {
    return <span style={{ fontSize: 11, color: "#484f58", fontStyle: "italic" }}>needs refresh</span>;
  }
  const { total, invited, responded, onboarded, blocked } = funnel;
  const w = (n) => `${Math.max((n / total) * 100, 0)}%`;
  return (
    <div
      style={{ display: "flex", height: 8, width: "100%", borderRadius: 4, overflow: "hidden", background: "#21262d" }}
      title={`${onboarded} onboarded · ${responded} responded · ${blocked} blocked · ${total} total`}
    >
      <div style={{ width: w(onboarded), background: "#3fb950" }} />
      <div style={{ width: w(Math.max(responded - onboarded, 0)), background: "#58a6ff" }} />
      <div style={{ width: w(Math.max(invited - responded, 0)), background: "#484f58" }} />
      <div style={{ width: w(blocked), background: "#e5534b" }} />
    </div>
  );
}

function FunnelDetail({ funnel }) {
  if (!funnel) {
    return (
      <div style={{ fontSize: 12, color: "#8b949e", fontStyle: "italic", padding: "8px 0" }}>
        Funnel data not yet refreshed for this project (Salesforce connection was unavailable during last sync).
      </div>
    );
  }
  const { total, invited, responded, onboarded, blocked } = funnel;
  const steps = [
    { label: "Cases created", sub: "list shared", val: total, bg: "#21262d" },
    { label: "Invited", sub: "past New", val: invited, bg: "#1a2a3d" },
    { label: "Responded", sub: "carrier working+", val: responded, bg: "#1a2a3d" },
    { label: "Onboarded", sub: "complete", val: onboarded, bg: "#16291c" },
    { label: "Blocked", sub: "on hold / removed", val: blocked, bg: "#2d1a1a" },
  ];
  return (
    <div style={{ display: "flex", gap: 2, marginTop: 8, marginBottom: 8 }}>
      {steps.map((s, i) => (
        <div key={i} style={{ flex: 1, textAlign: "center", padding: "8px 4px", background: s.bg, border: "1px solid #30363d" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#e6edf3" }}>{s.val}</div>
          <div style={{ fontSize: 10, color: "#8b949e" }}>{s.label}</div>
          <div style={{ fontSize: 9, color: "#484f58" }}>{s.sub}</div>
        </div>
      ))}
    </div>
  );
}

export default function NAProjects() {
  const [naFilter, setNaFilter] = useState("");
  const [healthFilter, setHealthFilter] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const naNames = useMemo(() => [...new Set(PROJECTS.map((p) => p.na))].sort(), []);

  const filtered = useMemo(() => {
    return PROJECTS.filter((p) => {
      if (naFilter && p.na !== naFilter) return false;
      if (healthFilter) {
        const h = healthLabel(p).label;
        if (healthFilter === "overdue" && !["Overdue", "Stalled?"].includes(h) && !h.includes("blocker")) return false;
        if (healthFilter === "on-track" && !["On track", "In progress"].includes(h)) return false;
        if (healthFilter === "complete" && h !== "Complete") return false;
      }
      return true;
    });
  }, [naFilter, healthFilter]);

  const liveCount = filtered.filter((p) => p.funnelStatus === "live").length;
  const pendingCount = filtered.filter((p) => p.funnelStatus === "pending").length;

  const s = {
    th: { padding: "6px 10px", background: "#1e2a45", textAlign: "left", fontWeight: 600, color: "#8b949e", whiteSpace: "nowrap", fontSize: "0.75rem" },
    td: { padding: "6px 10px", borderBottom: "1px solid #21262d", verticalAlign: "middle" },
    select: { fontSize: "0.78rem", padding: "5px 8px", borderRadius: 6, border: "1px solid #30363d", background: "#161b22", color: "#c9d1d9" },
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, margin: 0, color: "#58a6ff" }}>📦 NA Projects — Active Implementations</h1>
          <div style={{ fontSize: "0.75rem", color: "#8b949e", marginTop: 4 }}>
            {filtered.length} projects · as of {AS_OF} &nbsp;·&nbsp; funnel data: {liveCount} live, {pendingCount} pending refresh
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select style={s.select} value={naFilter} onChange={(e) => setNaFilter(e.target.value)}>
            <option value="">All NAs</option>
            {naNames.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <select style={s.select} value={healthFilter} onChange={(e) => setHealthFilter(e.target.value)}>
            <option value="">All health</option>
            <option value="overdue">Overdue / blockers</option>
            <option value="on-track">On track</option>
            <option value="complete">Complete</option>
          </select>
        </div>
      </div>

      {pendingCount > 0 && (
        <div style={{ fontSize: "0.72rem", color: "#e3b341", background: "#2b2111", border: "1px solid #4d3c14", borderRadius: 6, padding: "8px 12px", marginBottom: 14 }}>
          ⚠ {pendingCount} project funnel{pendingCount > 1 ? "s" : ""} pending refresh — Salesforce connection was unavailable during last sync. Ask Claude to "refresh the NA funnel data" once VPN/SF access is back.
        </div>
      )}

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem" }}>
          <thead>
            <tr>
              <th style={s.th}>Customer</th>
              <th style={s.th}>NA</th>
              <th style={s.th}>Kickoff</th>
              <th style={s.th}>Wks</th>
              <th style={s.th}>Target close</th>
              <th style={{ ...s.th, textAlign: "center" }}>Carriers</th>
              <th style={{ ...s.th, width: 140 }}>Onboarding funnel</th>
              <th style={s.th}>Health</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const wks = weeksElapsed(p.kickoff);
              const h = healthLabel(p);
              const isOverdue = p.estClose && new Date(p.estClose) < TODAY;
              const isExpanded = expandedId === p.id;
              return (
                <Fragment key={p.id}>
                  <tr
                    onClick={() => setExpandedId(isExpanded ? null : p.id)}
                    style={{ cursor: "pointer", background: isExpanded ? "#161b22" : "transparent" }}
                  >
                    <td style={{ ...s.td, fontWeight: 600 }}>{p.customer}</td>
                    <td style={{ ...s.td, color: "#8b949e" }}>{p.na.split(" ")[0]}</td>
                    <td style={s.td}>{fmtDate(p.kickoff)}</td>
                    <td style={s.td}>{wks != null ? `${wks}w` : "—"}</td>
                    <td style={{ ...s.td, color: isOverdue ? "#e55" : "#e6edf3", fontWeight: isOverdue ? 700 : 400 }}>
                      {fmtDate(p.estClose)}{isOverdue ? " ⚠" : ""}
                    </td>
                    <td style={{ ...s.td, textAlign: "center" }}>{p.carriers || "—"}</td>
                    <td style={s.td}>
                      <FunnelBar funnel={p.funnel} />
                    </td>
                    <td style={s.td}>
                      <span style={{ color: h.color, fontWeight: 600, fontSize: "0.75rem" }}>{h.label}</span>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan={8} style={{ padding: "12px 18px", background: "#0d1117", borderBottom: "1px solid #21262d" }}>
                        <div style={{ fontSize: "0.75rem", color: "#8b949e", marginBottom: 6 }}>{p.impl}</div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                          {p.modes.map((m) => (
                            <span key={m} style={{ fontSize: 10, background: "#132338", color: "#58a6ff", padding: "2px 8px", borderRadius: 8, fontWeight: 600 }}>{m}</span>
                          ))}
                        </div>
                        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#8b949e", textTransform: "uppercase", letterSpacing: ".04em", marginTop: 10 }}>
                          Carrier onboarding funnel
                        </div>
                        <FunnelDetail funnel={p.funnel} />
                        <div style={{ fontSize: "0.68rem", color: "#484f58", marginTop: 2 }}>
                          Note: Phase/Wave is not tracked at the case level in Salesforce — funnel reflects overall status, not per-wave breakdown.
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 12, fontSize: "0.72rem", color: "#484f58" }}>
        Funnel: created → invited (past "New") → responded (Carrier Working+) → onboarded (Complete) vs. blocked (On Hold / Removed). Snapshot refreshed manually from Salesforce.
      </div>
    </div>
  );
}
