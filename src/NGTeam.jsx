import { useState, useMemo } from "react";

const AS_OF     = "July 9, 2026 — Live from Salesforce (open/aged/closed/new, trailing 7d); medians as of Jun 28";
const THIS_WEEK = "Jul 3–9";
const PREV_WEEK = "Jun 26–Jul 2";

const WEEK_LABELS = ["Jun 2–8", "Jun 9–15", "Jun 16–22", "Jun 23–29", "Jun 30–Jul 6"];

// Team median trend (raw & adj) — capped at 365d to exclude compliance bulk-closes
// Raw: median of per-analyst medians each week (cases ≤365d old only)
// Adj: ~70% of raw (mirrors individual raw/adj ratio)
const TEAM_MEDIAN_TREND_RAW = [82, 48, 62, 67, 74];
const TEAM_MEDIAN_TREND_ADJ = [57, 34, 43, 47, 48];

const TEAM = [
  { name:"Aline Ventura", region:"Americas",
    open:{new:39,addon:66,update:37,all:146}, a30:{new:32,addon:61,update:7,all:102},
    a100:{new:1,addon:4,update:1,all:6}, cl7:{new:1,addon:3,update:4,all:8},
    cp7:{new:2,addon:3,update:6,all:11}, n7:{new:0,addon:0,update:1,all:1},
    np7:{new:4,addon:3,update:16,all:26}, openp7:153,
    median:{new:99,addon:84,update:42,all:69}, medianAdj:{new:67,addon:55,update:30,all:48},
    medianTrend:[124,108,60,64,26] },
  { name:"Daisy Marquez", region:"Americas",
    open:{new:14,addon:9,update:22,all:55}, a30:{new:14,addon:9,update:22,all:54},
    a100:{new:10,addon:6,update:22,all:46}, cl7:{new:0,addon:0,update:0,all:0},
    cp7:{new:0,addon:0,update:0,all:0}, n7:{new:0,addon:0,update:0,all:0},
    np7:{new:0,addon:0,update:0,all:0}, openp7:55,
    median:{new:200,addon:200,update:186,all:91}, medianAdj:{new:160,addon:162,update:148,all:70},
    medianTrend:[null,null,null,null,null] },
  { name:"Jevon Jackson", region:"Americas",
    open:{new:25,addon:25,update:20,all:73}, a30:{new:25,addon:17,update:19,all:64},
    a100:{new:13,addon:5,update:3,all:24}, cl7:{new:0,addon:1,update:0,all:1},
    cp7:{new:3,addon:1,update:0,all:4}, n7:{new:0,addon:4,update:0,all:4},
    np7:{new:0,addon:4,update:0,all:4}, openp7:70,
    median:{new:58,addon:50,update:37,all:45}, medianAdj:{new:42,addon:36,update:27,all:24},
    medianTrend:[44,53,45,71,74] },
  { name:"Kristen Whitman", region:"Americas",
    open:{new:4,addon:14,update:5,all:23}, a30:{new:4,addon:13,update:4,all:21},
    a100:{new:1,addon:3,update:2,all:6}, cl7:{new:2,addon:1,update:1,all:4},
    cp7:{new:0,addon:0,update:0,all:0}, n7:{new:0,addon:1,update:0,all:1},
    np7:{new:0,addon:0,update:1,all:1}, openp7:26,
    median:{new:91,addon:90,update:39,all:69}, medianAdj:{new:64,addon:63,update:28,all:48},
    medianTrend:[172,200,85,36,328] },
  { name:"Kristina Quirouette", region:"Americas",
    open:{new:60,addon:10,update:11,all:100}, a30:{new:40,addon:3,update:8,all:62},
    a100:{new:6,addon:2,update:1,all:19}, cl7:{new:0,addon:0,update:0,all:0},
    cp7:{new:1,addon:1,update:1,all:3}, n7:{new:0,addon:0,update:0,all:2},
    np7:{new:0,addon:0,update:0,all:3}, openp7:98,
    median:{new:132,addon:72,update:76,all:56}, medianAdj:{new:94,addon:51,update:54,all:35},
    medianTrend:[169,44,64,110,91] },
  { name:"Mariana Freitas", region:"Americas",
    open:{new:15,addon:10,update:14,all:45}, a30:{new:11,addon:6,update:14,all:37},
    a100:{new:3,addon:3,update:0,all:6}, cl7:{new:0,addon:0,update:1,all:1},
    cp7:{new:2,addon:1,update:3,all:6}, n7:{new:0,addon:0,update:0,all:0},
    np7:{new:0,addon:0,update:0,all:0}, openp7:46,
    median:{new:65,addon:55,update:48,all:52}, medianAdj:{new:45,addon:38,update:33,all:36},
    medianTrend:[45,38,81,68,66] },
  { name:"Nia Gillenwater", region:"Americas",
    open:{new:12,addon:24,update:25,all:65}, a30:{new:12,addon:18,update:18,all:51},
    a100:{new:2,addon:2,update:6,all:11}, cl7:{new:0,addon:2,update:1,all:3},
    cp7:{new:3,addon:0,update:2,all:5}, n7:{new:0,addon:0,update:0,all:1},
    np7:{new:0,addon:2,update:2,all:4}, openp7:67,
    median:{new:88,addon:79,update:65,all:72}, medianAdj:{new:60,addon:54,update:45,all:50},
    medianTrend:[120,18,59,67,null] },
  { name:"Fabrizio Ramirez", region:"Americas",
    open:{new:8,addon:9,update:13,all:38}, a30:{new:5,addon:5,update:6,all:17},
    a100:{new:0,addon:2,update:0,all:2}, cl7:{new:0,addon:0,update:2,all:2},
    cp7:{new:0,addon:0,update:1,all:1}, n7:{new:0,addon:0,update:0,all:0},
    np7:{new:0,addon:1,update:0,all:8}, openp7:40,
    median:{new:28,addon:22,update:18,all:22}, medianAdj:{new:20,addon:16,update:13,all:16},
    medianTrend:[null,48,null,40,32] },
  { name:"Nathalie Lesmes", region:"EU",
    open:{new:13,addon:13,update:4,all:39}, a30:{new:10,addon:12,update:2,all:33},
    a100:{new:8,addon:8,update:0,all:25}, cl7:{new:0,addon:0,update:0,all:0},
    cp7:{new:0,addon:0,update:0,all:0}, n7:{new:0,addon:0,update:0,all:0},
    np7:{new:0,addon:0,update:1,all:2}, openp7:39,
    median:{new:145,addon:138,update:120,all:135}, medianAdj:{new:105,addon:100,update:87,all:98},
    medianTrend:[44,173,50,88,null] },
  { name:"Oleksii Kosenko", region:"EU",
    open:{new:9,addon:25,update:16,all:58}, a30:{new:9,addon:23,update:15,all:54},
    a100:{new:5,addon:2,update:11,all:22}, cl7:{new:0,addon:0,update:0,all:0},
    cp7:{new:0,addon:0,update:0,all:0}, n7:{new:0,addon:0,update:0,all:1},
    np7:{new:0,addon:0,update:0,all:0}, openp7:57,
    median:{new:110,addon:95,update:88,all:92}, medianAdj:{new:78,addon:68,update:63,all:66},
    medianTrend:[32,13,222,null,138] },
  { name:"Prathiba Seetharaman", region:"EU",
    open:{new:7,addon:12,update:2,all:29}, a30:{new:5,addon:5,update:1,all:18},
    a100:{new:4,addon:3,update:0,all:12}, cl7:{new:0,addon:0,update:0,all:0},
    cp7:{new:0,addon:0,update:0,all:0}, n7:{new:0,addon:0,update:1,all:2},
    np7:{new:0,addon:1,update:0,all:1}, openp7:27,
    median:{new:120,addon:110,update:95,all:108}, medianAdj:{new:87,addon:80,update:69,all:78},
    medianTrend:[null,null,null,null,null] },
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
