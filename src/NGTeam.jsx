import { useState, useMemo } from "react";

const LAST_REFRESHED = "July 16, 2026 · 5:50 PM CT";
const AS_OF     = "July 16, 2026 — Live from Salesforce (open/aged/closed/new, trailing 7d); medians recomputed from full Jan 1, 2026+ closed-case census, \"All\" excludes null-reason cases (bulk/administrative closes, not onboarding work)";
const THIS_WEEK = "Jul 10–16";
const PREV_WEEK = "Jul 3–9";

const WEEK_LABELS = ["Jun 9–15", "Jun 16–22", "Jun 23–29", "Jun 30–Jul 6", "Jul 16 (recompute)"];

// Team median trend (raw & adj) — capped at 365d to exclude compliance bulk-closes
// Latest point (Jul 16) is a TRUE median from full Jan 2026+ closed-case census per analyst, pooled, excluding null-reason cases.
// Prior points were carried-forward estimates.
const TEAM_MEDIAN_TREND_RAW = [48, 62, 67, 74, 41];
const TEAM_MEDIAN_TREND_ADJ = [34, 43, 47, 48, 31];

const TEAM = [
  { name:"Aline Ventura", region:"Americas",
    open:{new:34,addon:58,update:30,all:126}, a30:{new:28,addon:55,update:18,all:102},
    a100:{new:1,addon:3,update:0,all:4}, cl7:{new:1,addon:1,update:7,all:10},
    cp7:{new:0,addon:0,update:4,all:4}, n7:{new:0,addon:0,update:0,all:2},
    np7:{new:0,addon:0,update:0,all:0}, openp7:134,
    median:{new:76,addon:62,update:22,all:32}, medianAdj:{new:40,addon:34,update:22,all:27},
    medianTrend:[108,60,64,26,32] },
  { name:"Daisy Marquez", region:"Americas",
    open:{new:12,addon:9,update:21,all:52}, a30:{new:12,addon:9,update:21,all:52},
    a100:{new:9,addon:9,update:21,all:47}, cl7:{new:0,addon:0,update:0,all:0},
    cp7:{new:0,addon:0,update:0,all:0}, n7:{new:0,addon:0,update:0,all:0},
    np7:{new:0,addon:0,update:0,all:0}, openp7:52,
    median:{new:93,addon:52,update:179,all:93}, medianAdj:{new:46,addon:52,update:179,all:52},
    medianTrend:[null,null,null,null,93] },
  { name:"Jevon Jackson", region:"Americas",
    open:{new:45,addon:25,update:15,all:88}, a30:{new:24,addon:14,update:14,all:55},
    a100:{new:15,addon:5,update:5,all:28}, cl7:{new:1,addon:3,update:6,all:10},
    cp7:{new:0,addon:0,update:3,all:3}, n7:{new:21,addon:4,update:0,all:25},
    np7:{new:0,addon:4,update:0,all:4}, openp7:73,
    median:{new:43,addon:48,update:41,all:42}, medianAdj:{new:28,addon:33,update:29,all:29},
    medianTrend:[53,45,71,74,42] },
  { name:"Kristen Whitman", region:"Americas",
    open:{new:3,addon:12,update:4,all:19}, a30:{new:2,addon:11,update:2,all:15},
    a100:{new:0,addon:2,update:2,all:4}, cl7:{new:0,addon:0,update:0,all:0},
    cp7:{new:2,addon:2,update:1,all:5}, n7:{new:1,addon:0,update:1,all:2},
    np7:{new:1,addon:0,update:0,all:1}, openp7:17,
    median:{new:42,addon:45,update:17,all:42}, medianAdj:{new:28,addon:45,update:17,all:28},
    medianTrend:[200,85,36,328,42] },
  { name:"Kristina Quirouette", region:"Americas",
    open:{new:61,addon:10,update:9,all:101}, a30:{new:41,addon:9,update:7,all:69},
    a100:{new:6,addon:2,update:1,all:19}, cl7:{new:0,addon:0,update:2,all:5},
    cp7:{new:0,addon:1,update:0,all:1}, n7:{new:1,addon:0,update:0,all:3},
    np7:{new:1,addon:0,update:0,all:4}, openp7:103,
    median:{new:63,addon:58,update:50,all:62}, medianAdj:{new:63,addon:28,update:50,all:56},
    medianTrend:[44,64,110,91,62] },
  { name:"Mariana Freitas", region:"Americas",
    open:{new:18,addon:13,update:17,all:54}, a30:{new:12,addon:9,update:9,all:36},
    a100:{new:2,addon:3,update:1,all:6}, cl7:{new:0,addon:0,update:1,all:1},
    cp7:{new:0,addon:0,update:0,all:0}, n7:{new:2,addon:1,update:2,all:5},
    np7:{new:0,addon:0,update:0,all:0}, openp7:50,
    median:{new:50,addon:44,update:32,all:40}, medianAdj:{new:34,addon:35,update:31,all:34},
    medianTrend:[38,81,68,66,40] },
  { name:"Nia Gillenwater", region:"Americas",
    open:{new:12,addon:25,update:28,all:69}, a30:{new:10,addon:23,update:19,all:55},
    a100:{new:1,addon:3,update:6,all:11}, cl7:{new:1,addon:1,update:1,all:5},
    cp7:{new:0,addon:2,update:3,all:5}, n7:{new:1,addon:1,update:2,all:7},
    np7:{new:0,addon:1,update:1,all:5}, openp7:67,
    median:{new:84,addon:61,update:26,all:47}, medianAdj:{new:80,addon:43,update:24,all:28},
    medianTrend:[18,59,67,null,47] },
  { name:"Fabrizio Ramirez", region:"Americas",
    open:{new:6,addon:11,update:19,all:44}, a30:{new:4,addon:10,update:5,all:20},
    a100:{new:0,addon:1,update:0,all:1}, cl7:{new:1,addon:1,update:0,all:2},
    cp7:{new:0,addon:0,update:1,all:1}, n7:{new:0,addon:0,update:2,all:2},
    np7:{new:0,addon:0,update:1,all:1}, openp7:44,
    median:{new:35,addon:0,update:31,all:34}, medianAdj:{new:15,addon:0,update:28,all:28},
    medianTrend:[48,null,40,32,34] },
  { name:"Nathalie Lesmes", region:"EU",
    open:{new:16,addon:13,update:4,all:43}, a30:{new:13,addon:12,update:3,all:37},
    a100:{new:8,addon:8,update:0,all:25}, cl7:{new:0,addon:0,update:0,all:3},
    cp7:{new:1,addon:1,update:3,all:10}, n7:{new:1,addon:0,update:0,all:2},
    np7:{new:0,addon:0,update:0,all:1}, openp7:44,
    median:{new:45,addon:56,update:39,all:42}, medianAdj:{new:32,addon:52,update:15,all:33},
    medianTrend:[173,50,88,null,42] },
  { name:"Oleksii Kosenko", region:"EU",
    open:{new:11,addon:27,update:17,all:63}, a30:{new:11,addon:25,update:15,all:58},
    a100:{new:8,addon:2,update:12,all:26}, cl7:{new:0,addon:0,update:0,all:0},
    cp7:{new:0,addon:0,update:0,all:0}, n7:{new:0,addon:0,update:1,all:1},
    np7:{new:0,addon:0,update:0,all:0}, openp7:62,
    median:{new:160,addon:31,update:1,all:76}, medianAdj:{new:109,addon:30,update:1,all:60},
    medianTrend:[13,222,null,138,76] },
  { name:"Prathiba Seetharaman", region:"EU",
    open:{new:7,addon:12,update:2,all:29}, a30:{new:5,addon:5,update:1,all:18},
    a100:{new:4,addon:3,update:0,all:13}, cl7:{new:0,addon:0,update:0,all:0},
    cp7:{new:0,addon:0,update:0,all:0}, n7:{new:0,addon:0,update:0,all:1},
    np7:{new:0,addon:0,update:1,all:2}, openp7:28,
    median:{new:0,addon:99,update:0,all:99}, medianAdj:{new:0,addon:84,update:0,all:84},
    medianTrend:[null,null,null,null,99] },
];

const REASON_LABELS = { new:"New", addon:"Add-on", update:"Update", all:"All" };

function Sparkline({ data, width=80, height=28 }) {
  const valid = data.filter(v => v !== null);
  if (valid.length < 2) return <span style={{color:"#484f58",fontSize:"0.7rem"}}>—</span>;
  const mn = Math.min(...valid), mx = Math.max(...valid);
  const range = mx - mn || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (width - 6) + 3;
    const y = v !== null ? height - 4 - ((v - mn) / range) * (height - 8) : null;
    return { x, y, v };
  });
  const linePts = pts.filter(p => p.y !== null);
  const pathD = linePts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const last = linePts[linePts.length - 1];
  const prev = linePts[linePts.length - 2];
  const trend = last && prev ? (last.v < prev.v ? '#4c4' : last.v > prev.v ? '#e55' : '#888') : '#888';
  return (
    <svg width={width} height={height} style={{verticalAlign:'middle',overflow:'visible'}}>
      <path d={pathD} fill="none" stroke="#3a4a6a" strokeWidth={1.5} strokeLinejoin="round" />
      {linePts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={i === linePts.length-1 ? 3 : 2}
          fill={i === linePts.length-1 ? trend : '#3a4a6a'} />
      ))}
    </svg>
  );
}

function wow(curr, prev) {
  const diff = curr - prev;
  if (diff === 0) return <span style={{color:"#888"}}>—</span>;
  const color = diff > 0 ? "#e55" : "#4c4";
  return <span style={{color}}>{diff > 0 ? "▲" : "▼"}{Math.abs(diff)}</span>;
}
function closeWow(curr, prev) {
  const diff = curr - prev;
  if (diff === 0) return <span style={{color:"#888"}}>—</span>;
  const color = diff > 0 ? "#4c4" : "#e55";
  return <span style={{color}}>{diff > 0 ? "▲" : "▼"}{Math.abs(diff)}</span>;
}
function medWow(trend) {
  const vals = trend.filter(v => v !== null);
  if (vals.length < 2) return <span style={{color:"#888"}}>—</span>;
  const curr = trend[trend.length-1], prev = trend.filter(v=>v!==null).slice(-2)[0];
  if (curr === null || prev === null) return <span style={{color:"#888"}}>—</span>;
  const diff = curr - prev;
  if (diff === 0) return <span style={{color:"#888"}}>—</span>;
  const color = diff > 0 ? "#e55" : "#4c4";
  return <span style={{color}}>{diff > 0 ? "▲" : "▼"}{Math.abs(diff)}d</span>;
}
function badge(val, warn=80, danger=40) {
  if (val === 0) return "🟢";
  if (val <= danger) return "🟢";
  if (val <= warn) return "🟡";
  return "🔴";
}
function a100Badge(val) {
  if (val === 0) return "🟢";
  if (val <= 5) return "🟡";
  return "🔴";
}

function NGTeam() {
  const [region, setRegion]   = useState("All");
  const [ctype,  setCtype]    = useState("all");
  const [medMode, setMedMode] = useState("raw");
  const [sortCol, setSortCol] = useState("open");
  const [sortDir, setSortDir] = useState("desc");
  const [showTrend, setShowTrend] = useState(false);

  const filtered = useMemo(() =>
    TEAM.filter(r => region === "All" || r.region === region), [region]);

  const sorted = useMemo(() => {
    const key = ctype;
    return [...filtered].sort((a,b) => {
      let av, bv;
      switch(sortCol) {
        case "open":   av=a.open[key];  bv=b.open[key];  break;
        case "a30":    av=a.a30[key];   bv=b.a30[key];   break;
        case "a100":   av=a.a100[key];  bv=b.a100[key];  break;
        case "cl7":    av=a.cl7[key];   bv=b.cl7[key];   break;
        case "cp7":    av=a.cp7[key];   bv=b.cp7[key];   break;
        case "n7":     av=a.n7[key];    bv=b.n7[key];    break;
        case "median":
          av=medMode==="raw"?a.median[key]:a.medianAdj[key];
          bv=medMode==="raw"?b.median[key]:b.medianAdj[key]; break;
        default: av=a.open[key]; bv=b.open[key];
      }
      return sortDir==="desc" ? bv-av : av-bv;
    });
  }, [filtered, ctype, sortCol, sortDir, medMode]);

  const totals = useMemo(() => {
    const k = ctype;
    return {
      open:   sorted.reduce((s,r)=>s+r.open[k],0),
      a30:    sorted.reduce((s,r)=>s+r.a30[k],0),
      a100:   sorted.reduce((s,r)=>s+r.a100[k],0),
      cl7:    sorted.reduce((s,r)=>s+r.cl7[k],0),
      cp7:    sorted.reduce((s,r)=>s+r.cp7[k],0),
      n7:     sorted.reduce((s,r)=>s+r.n7[k],0),
      np7:    sorted.reduce((s,r)=>s+r.np7[k],0),
      openp7: sorted.reduce((s,r)=>s+r.openp7,0),
    };
  }, [sorted, ctype]);

  const medKey = medMode==="raw"?"median":"medianAdj";

  // Team median this week — respects both case type filter AND raw/adj toggle
  const teamMedianThisWk = useMemo(() => {
    const vals = sorted.map(r => r[medKey][ctype]).filter(v => v != null);
    if (!vals.length) return null;
    const sv = [...vals].sort((a,b)=>a-b);
    return Math.round(sv.length%2===0 ? (sv[sv.length/2-1]+sv[sv.length/2])/2 : sv[Math.floor(sv.length/2)]);
  }, [sorted, medKey, ctype]);

  // Prior week reference from pre-computed team trend (all-types baseline)
  const teamTrend = medMode==="raw" ? TEAM_MEDIAN_TREND_RAW : TEAM_MEDIAN_TREND_ADJ;
  const teamMedianPrevWk = teamTrend[3] ?? null;

  function SortHdr({col, children, right}) {
    const active = sortCol===col;
    return (
      <th onClick={()=>{ if(sortCol===col) setSortDir(d=>d==="desc"?"asc":"desc"); else {setSortCol(col);setSortDir("desc");} }}
        style={{cursor:"pointer",whiteSpace:"nowrap",padding:"6px 10px",background:active?"#2a3a5c":"#1e2a45",
          userSelect:"none",textAlign:right?"right":"left"}}>
        {children}{active?(sortDir==="desc"?" ↓":" ↑"):""}
      </th>
    );
  }

  const s = {
    app:   {fontFamily:"'Inter',sans-serif",background:"#0d1117",minHeight:"100vh",color:"#e6edf3",padding:"20px"},
    h1:    {fontSize:"1.4rem",fontWeight:700,margin:0,color:"#58a6ff"},
    asOf:  {fontSize:"0.75rem",color:"#8b949e",marginTop:4},
    lastRefreshed: {fontSize:"0.95rem",color:"#58a6ff",fontWeight:700,marginTop:2},
    filt:  {display:"flex",gap:12,flexWrap:"wrap",marginBottom:18,alignItems:"center"},
    btn:   (a)=>({padding:"5px 14px",borderRadius:6,border:"1px solid #30363d",
      background:a?"#1f6feb":"#161b22",color:a?"#fff":"#c9d1d9",cursor:"pointer",
      fontSize:"0.82rem",fontWeight:a?600:400}),
    cards: {display:"flex",gap:12,flexWrap:"wrap",marginBottom:20},
    card:  {background:"#161b22",border:"1px solid #30363d",borderRadius:8,padding:"12px 18px",minWidth:120},
    cLbl:  {fontSize:"0.7rem",color:"#8b949e",marginBottom:4},
    cVal:  {fontSize:"1.5rem",fontWeight:700,color:"#e6edf3"},
    cSub:  {fontSize:"0.7rem",color:"#8b949e",marginTop:2},
    table: {width:"100%",borderCollapse:"collapse",fontSize:"0.83rem"},
    th:    {padding:"6px 10px",background:"#1e2a45",textAlign:"left",fontWeight:600,color:"#8b949e",whiteSpace:"nowrap"},
    td:    {padding:"6px 10px",borderBottom:"1px solid #21262d",verticalAlign:"middle"},
    tdR:   {padding:"6px 10px",borderBottom:"1px solid #21262d",textAlign:"right",verticalAlign:"middle"},
    foot:  {padding:"6px 10px",background:"#1a2236",fontWeight:700,textAlign:"right"},
    footL: {padding:"6px 10px",background:"#1a2236",fontWeight:700},
  };

  const k = ctype;
  const medDelta = teamMedianThisWk !== null && teamMedianPrevWk !== null
    ? teamMedianThisWk - teamMedianPrevWk : null;

  return (
    <div>
      <div style={{marginBottom:20}}>
        <h1 style={s.h1}>🚀 NG Team Dashboard</h1>
        <div style={s.lastRefreshed}>🕒 Last refreshed: {LAST_REFRESHED}</div>
        <div style={s.asOf}>As of {AS_OF} &nbsp;·&nbsp; Week: {THIS_WEEK} &nbsp;·&nbsp; Prev: {PREV_WEEK}</div>
      </div>

      <div style={s.filt}>
        <div>
          <span style={{fontSize:"0.75rem",color:"#8b949e",marginRight:6}}>Region:</span>
          {["All","Americas","EU"].map(r=>(
            <button key={r} style={s.btn(region===r)} onClick={()=>setRegion(r)}>{r}</button>
          ))}
        </div>
        <div>
          <span style={{fontSize:"0.75rem",color:"#8b949e",marginRight:6}}>Case Type:</span>
          {Object.entries(REASON_LABELS).map(([k,v])=>(
            <button key={k} style={s.btn(ctype===k)} onClick={()=>setCtype(k)}>{v}</button>
          ))}
        </div>
        <div>
          <span style={{fontSize:"0.75rem",color:"#8b949e",marginRight:6}}>Median:</span>
          <button style={s.btn(medMode==="raw")} onClick={()=>setMedMode("raw")}>Raw</button>
          <button style={s.btn(medMode==="adj")} onClick={()=>setMedMode("adj")}>Adjusted</button>
        </div>
        <div>
          <button style={s.btn(showTrend)} onClick={()=>setShowTrend(t=>!t)}>
            {showTrend ? "Hide Trend" : "📈 Show 5-Week Trend"}
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div style={s.cards}>
        {[
          {label:"Open (live)",val:totals.open,sub:"All open cases"},
          {label:">30d Open",val:totals.a30,sub:"Aged backlog"},
          {label:">100d Open",val:totals.a100,sub:"Critical aged"},
          {label:`Closed ${THIS_WEEK}`,val:totals.cl7,sub:"This week"},
          {label:`Closed ${PREV_WEEK}`,val:totals.cp7,sub:"Prior week"},
          {label:`New ${THIS_WEEK}`,val:totals.n7,sub:"Opened this week"},
        ].map(c=>(
          <div key={c.label} style={s.card}>
            <div style={s.cLbl}>{c.label}</div>
            <div style={s.cVal}>{c.val}</div>
            <div style={s.cSub}>{c.sub}</div>
          </div>
        ))}
        <div style={s.card}>
          <div style={s.cLbl}>Backlog WoW</div>
          <div style={s.cVal}>{totals.open-totals.openp7>=0?"+":""}{totals.open-totals.openp7}</div>
          <div style={s.cSub}>vs last week ({totals.openp7} open)</div>
        </div>
        <div style={s.card}>
          <div style={s.cLbl}>Median Days to Close</div>
          <div style={s.cVal}>{teamMedianThisWk ?? "—"}d</div>
          <div style={s.cSub}>
            {medDelta !== null
              ? <span style={{color:medDelta>0?"#e55":"#4c4"}}>
                  {medDelta>0?"▲":"▼"}{Math.abs(medDelta)}d vs prev wk
                </span>
              : "Team median this week"}
          </div>
        </div>
      </div>

      {/* Trend panel */}
      {showTrend && (
        <div style={{background:"#161b22",border:"1px solid #30363d",borderRadius:8,padding:"16px",marginBottom:20,overflowX:"auto"}}>
          <div style={{fontSize:"0.85rem",fontWeight:600,color:"#58a6ff",marginBottom:12}}>
            📈 5-Week Median Days-to-Close Trend
          </div>
          <table style={{...s.table,fontSize:"0.8rem"}}>
            <thead>
              <tr>
                <th style={s.th}>Analyst</th>
                {WEEK_LABELS.map(w=><th key={w} style={{...s.th,textAlign:"right"}}>{w}</th>)}
                <th style={{...s.th,textAlign:"center"}}>Trend</th>
                <th style={{...s.th,textAlign:"right"}}>WoW Δ</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(row=>{
                const t = row.medianTrend;
                const curr = t[4], prev = t.filter(v=>v!==null).slice(-2)[0];
                const delta = curr!==null && prev!==null && curr!==prev ? curr-prev : null;
                return (
                  <tr key={row.name}>
                    <td style={s.td}><strong>{row.name}</strong></td>
                    {t.map((v,i)=>{
                      const color = v===null?"#484f58":v>100?"#e55":v>50?"#fa0":"#4c4";
                      return <td key={i} style={{...s.tdR,color}}>{v!==null?`${v}d`:"—"}</td>;
                    })}
                    <td style={{...s.td,textAlign:"center"}}><Sparkline data={t} /></td>
                    <td style={s.tdR}>
                      {delta!==null
                        ? <span style={{color:delta>0?"#e55":"#4c4",fontWeight:600}}>
                            {delta>0?"▲":"▼"}{Math.abs(delta)}d
                          </span>
                        : <span style={{color:"#888"}}>—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{background:"#1a2236"}}>
                <td style={{...s.td,fontWeight:700,color:"#58a6ff",borderTop:"2px solid #30363d"}}>Team (median of medians)</td>
                {(medMode==="raw"?TEAM_MEDIAN_TREND_RAW:TEAM_MEDIAN_TREND_ADJ).map((v,i)=>{
                  const color = v===null?"#484f58":v>100?"#e55":v>50?"#fa0":"#4c4";
                  return <td key={i} style={{...s.tdR,color,fontWeight:700,borderTop:"2px solid #30363d"}}>{v!==null?`${v}d`:"—"}</td>;
                })}
                <td style={{...s.td,textAlign:"center",borderTop:"2px solid #30363d"}}>
                  <Sparkline data={medMode==="raw"?TEAM_MEDIAN_TREND_RAW:TEAM_MEDIAN_TREND_ADJ} />
                </td>
                <td style={{...s.tdR,fontWeight:700,borderTop:"2px solid #30363d"}}>
                  {(()=>{
                    const t = medMode==="raw"?TEAM_MEDIAN_TREND_RAW:TEAM_MEDIAN_TREND_ADJ;
                    const curr=t[4], prev=t[3];
                    if(curr===null||prev===null) return <span style={{color:"#888"}}>—</span>;
                    const d=curr-prev;
                    if(d===0) return <span style={{color:"#888"}}>—</span>;
                    return <span style={{color:d>0?"#e55":"#4c4"}}>{d>0?"▲":"▼"}{Math.abs(d)}d</span>;
                  })()}
                </td>
              </tr>
            </tfoot>
          </table>
          <div style={{marginTop:8,fontSize:"0.7rem",color:"#484f58"}}>
            Median computed from actual case-level data (CreatedDate → close date). Capped at 365d to exclude compliance bulk-closes. Colour: green &lt;50d · amber 50–100d · red &gt;100d.
          </div>
        </div>
      )}

      <div style={{overflowX:"auto"}}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Analyst</th>
              <th style={s.th}>Region</th>
              <SortHdr col="open">Open</SortHdr>
              <SortHdr col="a30">&gt;30d</SortHdr>
              <SortHdr col="a100">&gt;100d</SortHdr>
              <th style={{...s.th,textAlign:"right"}}>Backlog WoW</th>
              <SortHdr col="cl7" right>Closed {THIS_WEEK}</SortHdr>
              <SortHdr col="cp7" right>Closed {PREV_WEEK}</SortHdr>
              <th style={{...s.th,textAlign:"right"}}>Close WoW</th>
              <SortHdr col="n7" right>New {THIS_WEEK}</SortHdr>
              <th style={{...s.th,textAlign:"right"}}>New {PREV_WEEK}</th>
              <th style={{...s.th,textAlign:"right"}}>New WoW</th>
              <SortHdr col="median" right>Median{medMode==="adj"?" (Adj)":""}</SortHdr>
              <th style={{...s.th,textAlign:"right"}}>Med WoW</th>
              <th style={{...s.th,textAlign:"center"}}>Trend</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(row=>{
              const med = row[medKey][k];
              const medColor = med>90?"#e55":med>45?"#fa0":"#4c4";
              return (
                <tr key={row.name}>
                  <td style={s.td}><strong>{row.name}</strong></td>
                  <td style={s.td}><span style={{fontSize:"0.75rem",color:"#8b949e"}}>{row.region}</span></td>
                  <td style={s.tdR}>{row.open[k]}</td>
                  <td style={s.tdR}>{badge(row.a30[k])} {row.a30[k]}</td>
                  <td style={s.tdR}>{a100Badge(row.a100[k])} {row.a100[k]}</td>
                  <td style={s.tdR}>{wow(row.open[k],row.openp7)}</td>
                  <td style={s.tdR}>{row.cl7[k]}</td>
                  <td style={s.tdR}>{row.cp7[k]}</td>
                  <td style={s.tdR}>{closeWow(row.cl7[k],row.cp7[k])}</td>
                  <td style={s.tdR}>{row.n7[k]}</td>
                  <td style={s.tdR}>{row.np7[k]}</td>
                  <td style={s.tdR}>{wow(row.n7[k],row.np7[k])}</td>
                  <td style={s.tdR}><span style={{color:medColor,fontWeight:600}}>{med}d</span></td>
                  <td style={s.tdR}>{medWow(row.medianTrend)}</td>
                  <td style={{...s.td,textAlign:"center"}}><Sparkline data={row.medianTrend} /></td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td style={s.footL} colSpan={2}>Total / Team</td>
              <td style={s.foot}>{totals.open}</td>
              <td style={s.foot}>{totals.a30}</td>
              <td style={s.foot}>{totals.a100}</td>
              <td style={s.foot}>{wow(totals.open,totals.openp7)}</td>
              <td style={s.foot}>{totals.cl7}</td>
              <td style={s.foot}>{totals.cp7}</td>
              <td style={s.foot}>{closeWow(totals.cl7,totals.cp7)}</td>
              <td style={s.foot}>{totals.n7}</td>
              <td style={s.foot}>{totals.np7}</td>
              <td style={s.foot}>{wow(totals.n7,totals.np7)}</td>
              <td style={s.foot}>{teamMedianThisWk??'—'}d</td>
              <td style={s.foot}>{medDelta!==null?<span style={{color:medDelta>0?"#e55":"#4c4"}}>{medDelta>0?"▲":"▼"}{Math.abs(medDelta)}d</span>:"—"}</td>
              <td style={s.foot}>—</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div style={{marginTop:12,fontSize:"0.72rem",color:"#484f58"}}>
        Adjusted median excludes time in On Hold, FourKites Working, Awaiting Loads. Backlog WoW = open now vs est. open last week. Median WoW = this week vs prior available week. Sparkline = 5-week trend (green dot = improving, red = worsening).
      </div>
    </div>
  );
}





export default NGTeam;
