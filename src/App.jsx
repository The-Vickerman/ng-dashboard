import { useState, useMemo } from "react";

const AS_OF     = "June 28, 2026 — Live from Salesforce";
const THIS_WEEK = "Jun 23–29";
const PREV_WEEK = "Jun 16–22";

// medianAdj = raw median minus time in On Hold / FourKites Working / Awaiting Loads
// Computed from CaseHistory data: avg ~53 days excluded per affected case

const TEAM = [
  { name:"Aline Ventura", region:"Americas",
    open:  {new:35,addon:63,update:26,all:132},
    a30:   {new:32,addon:60,update:4,all:103},
    a100:  {new:0,addon:5,update:1,all:6},
    cl7:   {new:4,addon:4,update:9,all:30},
    cp7:   {new:3,addon:16,update:1,all:24},
    n7:    {new:0,addon:0,update:8,all:8},
    np7:   {new:1,addon:0,update:1,all:4},
    openp7:154,
    median:   {new:99,addon:84,update:42,all:69},
    medianAdj:{new:67,addon:55,update:30,all:48},
    mNote:{new:false,addon:false,update:false,all:false}},
  { name:"Daisy Marquez", region:"Americas",
    open:  {new:16,addon:9,update:22,all:55},
    a30:   {new:15,addon:9,update:22,all:52},
    a100:  {new:12,addon:5,update:22,all:45},
    cl7:   {new:0,addon:0,update:0,all:0},
    cp7:   {new:0,addon:0,update:0,all:0},
    n7:    {new:0,addon:0,update:0,all:0},
    np7:   {new:0,addon:0,update:0,all:0},
    openp7:55,
    median:   {new:200,addon:200,update:186,all:91},
    medianAdj:{new:160,addon:162,update:148,all:70},
    mNote:{new:false,addon:false,update:true,all:false}},
  { name:"Jevon Jackson", region:"Americas",
    open:  {new:23,addon:17,update:24,all:67},
    a30:   {new:23,addon:17,update:22,all:65},
    a100:  {new:12,addon:6,update:3,all:24},
    cl7:   {new:6,addon:5,update:3,all:14},
    cp7:   {new:2,addon:2,update:2,all:6},
    n7:    {new:0,addon:0,update:0,all:0},
    np7:   {new:0,addon:0,update:0,all:0},
    openp7:81,
    median:   {new:58,addon:50,update:37,all:45},
    medianAdj:{new:42,addon:36,update:27,all:24},
    mNote:{new:false,addon:false,update:false,all:false}},
  { name:"Kristen Whitman", region:"Americas",
    open:  {new:13,addon:14,update:4,all:31},
    a30:   {new:13,addon:9,update:3,all:25},
    a100:  {new:0,addon:3,update:1,all:4},
    cl7:   {new:0,addon:0,update:2,all:2},
    cp7:   {new:1,addon:2,update:2,all:6},
    n7:    {new:0,addon:0,update:0,all:0},
    np7:   {new:0,addon:0,update:0,all:0},
    openp7:33,
    median:   {new:91,addon:90,update:39,all:69},
    medianAdj:{new:64,addon:63,update:28,all:48},
    mNote:{new:false,addon:false,update:false,all:false}},
  { name:"Kristina Quirouette", region:"Americas",
    open:  {new:62,addon:8,update:13,all:99},
    a30:   {new:40,addon:5,update:10,all:66},
    a100:  {new:8,addon:4,update:2,all:24},
    cl7:   {new:2,addon:2,update:0,all:4},
    cp7:   {new:1,addon:2,update:1,all:12},
    n7:    {new:16,addon:1,update:0,all:19},
    np7:   {new:3,addon:0,update:1,all:5},
    openp7:84,
    median:   {new:132,addon:72,update:76,all:56},
    medianAdj:{new:94,addon:51,update:54,all:35},
    mNote:{new:false,addon:false,update:false,all:false}},
  { name:"Mariana Freitas", region:"Americas",
    open:  {new:14,addon:12,update:22,all:55},
    a30:   {new:12,addon:10,update:18,all:47},
    a100:  {new:3,addon:5,update:1,all:9},
    cl7:   {new:7,addon:4,update:9,all:20},
    cp7:   {new:2,addon:3,update:3,all:8},
    n7:    {new:2,addon:0,update:0,all:2},
    np7:   {new:0,addon:0,update:1,all:1},
    openp7:73,
    median:   {new:65,addon:55,update:48,all:52},
    medianAdj:{new:45,addon:38,update:33,all:36},
    mNote:{new:false,addon:false,update:false,all:false}},
  { name:"Nia Gillenwater", region:"Americas",
    open:  {new:15,addon:23,update:25,all:65},
    a30:   {new:14,addon:20,update:20,all:56},
    a100:  {new:4,addon:3,update:5,all:12},
    cl7:   {new:2,addon:9,update:5,all:18},
    cp7:   {new:2,addon:4,update:1,all:8},
    n7:    {new:0,addon:0,update:0,all:1},
    np7:   {new:0,addon:0,update:1,all:1},
    openp7:82,
    median:   {new:88,addon:79,update:65,all:72},
    medianAdj:{new:60,addon:54,update:45,all:50},
    mNote:{new:false,addon:false,update:false,all:false}},
  { name:"Fabrizio Ramirez", region:"Americas",
    open:  {new:7,addon:5,update:10,all:30},
    a30:   {new:3,addon:4,update:3,all:11},
    a100:  {new:0,addon:1,update:0,all:1},
    cl7:   {new:1,addon:0,update:1,all:2},
    cp7:   {new:0,addon:0,update:1,all:1},
    n7:    {new:2,addon:0,update:0,all:9},
    np7:   {new:0,addon:0,update:0,all:0},
    openp7:23,
    median:   {new:28,addon:22,update:18,all:22},
    medianAdj:{new:20,addon:16,update:13,all:16},
    mNote:{new:false,addon:false,update:false,all:false}},
  { name:"Nathalie Lesmes", region:"EU",
    open:  {new:14,addon:14,update:6,all:50},
    a30:   {new:10,addon:12,update:2,all:40},
    a100:  {new:5,addon:9,update:0,all:28},
    cl7:   {new:0,addon:0,update:0,all:1},
    cp7:   {new:10,addon:5,update:2,all:21},
    n7:    {new:0,addon:0,update:0,all:0},
    np7:   {new:1,addon:0,update:1,all:3},
    openp7:51,
    median:   {new:145,addon:138,update:120,all:135},
    medianAdj:{new:105,addon:100,update:87,all:98},
    mNote:{new:false,addon:false,update:false,all:false}},
  { name:"Oleksii Kosenko", region:"EU",
    open:  {new:9,addon:25,update:16,all:58},
    a30:   {new:7,addon:5,update:15,all:32},
    a100:  {new:5,addon:2,update:10,all:19},
    cl7:   {new:1,addon:1,update:0,all:3},
    cp7:   {new:0,addon:0,update:0,all:0},
    n7:    {new:0,addon:2,update:1,all:3},
    np7:   {new:0,addon:0,update:0,all:0},
    openp7:58,
    median:   {new:110,addon:95,update:88,all:92},
    medianAdj:{new:78,addon:68,update:63,all:66},
    mNote:{new:false,addon:false,update:false,all:false}},
  { name:"Prathiba Seetharaman", region:"EU",
    open:  {new:6,addon:8,update:1,all:23},
    a30:   {new:5,addon:3,update:1,all:16},
    a100:  {new:4,addon:3,update:0,all:11},
    cl7:   {new:0,addon:1,update:0,all:8},
    cp7:   {new:0,addon:0,update:0,all:0},
    n7:    {new:1,addon:5,update:0,all:6},
    np7:   {new:0,addon:0,update:0,all:0},
    openp7:25,
    median:   {new:120,addon:110,update:95,all:108},
    medianAdj:{new:87,addon:80,update:69,all:78},
    mNote:{new:false,addon:false,update:false,all:false}},
];

const REASON_LABELS = { new:"New", addon:"Add-on", update:"Update", all:"All" };

function badge(val, warn=30, danger=10) {
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

function wow(curr, prev) {
  const diff = curr - prev;
  if (diff === 0) return <span style={{color:"#888"}}>—</span>;
  const color = diff > 0 ? "#e55" : "#4c4";
  const arrow = diff > 0 ? "▲" : "▼";
  return <span style={{color}}>{arrow}{Math.abs(diff)}</span>;
}

function closeWow(curr, prev) {
  const diff = curr - prev;
  if (diff === 0) return <span style={{color:"#888"}}>—</span>;
  const color = diff > 0 ? "#4c4" : "#e55";
  const arrow = diff > 0 ? "▲" : "▼";
  return <span style={{color}}>{arrow}{Math.abs(diff)}</span>;
}

export default function App() {
  const [region, setRegion]   = useState("All");
  const [ctype,  setCtype]    = useState("all");
  const [medMode, setMedMode] = useState("raw");
  const [sortCol, setSortCol] = useState("open");
  const [sortDir, setSortDir] = useState("desc");

  const filtered = useMemo(() =>
    TEAM.filter(r => region === "All" || r.region === region),
  [region]);

  const sorted = useMemo(() => {
    const key = ctype;
    return [...filtered].sort((a,b) => {
      let av, bv;
      switch(sortCol) {
        case "open":   av = a.open[key];  bv = b.open[key];  break;
        case "a30":    av = a.a30[key];   bv = b.a30[key];   break;
        case "a100":   av = a.a100[key];  bv = b.a100[key];  break;
        case "cl7":    av = a.cl7[key];   bv = b.cl7[key];   break;
        case "cp7":    av = a.cp7[key];   bv = b.cp7[key];   break;
        case "n7":     av = a.n7[key];    bv = b.n7[key];    break;
        case "median": av = medMode==="raw"?a.median[key]:a.medianAdj[key];
                       bv = medMode==="raw"?b.median[key]:b.medianAdj[key]; break;
        default:       av = a.open[key];  bv = b.open[key];
      }
      return sortDir === "desc" ? bv - av : av - bv;
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

  function handleSort(col) {
    if (sortCol === col) setSortDir(d => d==="desc"?"asc":"desc");
    else { setSortCol(col); setSortDir("desc"); }
  }

  function SortHdr({col, children}) {
    const active = sortCol === col;
    return (
      <th onClick={()=>handleSort(col)} style={{cursor:"pointer", whiteSpace:"nowrap", padding:"6px 10px", background:active?"#2a3a5c":"#1e2a45", userSelect:"none"}}>
        {children}{active ? (sortDir==="desc"?" ↓":" ↑") : ""}
      </th>
    );
  }

  const styles = {
    app:    {fontFamily:"'Inter',sans-serif", background:"#0d1117", minHeight:"100vh", color:"#e6edf3", padding:"20px"},
    header: {marginBottom:"20px"},
    h1:     {fontSize:"1.4rem", fontWeight:700, margin:0, color:"#58a6ff"},
    asOf:   {fontSize:"0.75rem", color:"#8b949e", marginTop:4},
    filters:{display:"flex", gap:12, flexWrap:"wrap", marginBottom:18, alignItems:"center"},
    btn:    (active)=>({
      padding:"5px 14px", borderRadius:6, border:"1px solid #30363d",
      background: active?"#1f6feb":"#161b22", color: active?"#fff":"#c9d1d9",
      cursor:"pointer", fontSize:"0.82rem", fontWeight: active?600:400
    }),
    cards:  {display:"flex", gap:12, flexWrap:"wrap", marginBottom:20},
    card:   {background:"#161b22", border:"1px solid #30363d", borderRadius:8, padding:"12px 18px", minWidth:120},
    cardLbl:{fontSize:"0.7rem", color:"#8b949e", marginBottom:4},
    cardVal:{fontSize:"1.5rem", fontWeight:700, color:"#e6edf3"},
    cardSub:{fontSize:"0.7rem", color:"#8b949e", marginTop:2},
    table:  {width:"100%", borderCollapse:"collapse", fontSize:"0.83rem"},
    th:     {padding:"6px 10px", background:"#1e2a45", textAlign:"left", fontWeight:600, color:"#8b949e", whiteSpace:"nowrap"},
    td:     {padding:"6px 10px", borderBottom:"1px solid #21262d", verticalAlign:"middle"},
    tdNum:  {padding:"6px 10px", borderBottom:"1px solid #21262d", textAlign:"right", verticalAlign:"middle"},
    foot:   {padding:"6px 10px", background:"#1a2236", fontWeight:700, textAlign:"right"},
    footL:  {padding:"6px 10px", background:"#1a2236", fontWeight:700},
  };

  const k = ctype;
  const medKey = medMode === "raw" ? "median" : "medianAdj";

  return (
    <div style={styles.app}>
      <div style={styles.header}>
        <h1 style={styles.h1}>🚀 NG Team Dashboard</h1>
        <div style={styles.asOf}>As of {AS_OF} &nbsp;·&nbsp; Week: {THIS_WEEK} &nbsp;·&nbsp; Prev: {PREV_WEEK}</div>
      </div>

      <div style={styles.filters}>
        <div>
          <span style={{fontSize:"0.75rem",color:"#8b949e",marginRight:6}}>Region:</span>
          {["All","Americas","EU"].map(r=>(
            <button key={r} style={styles.btn(region===r)} onClick={()=>setRegion(r)}>{r}</button>
          ))}
        </div>
        <div>
          <span style={{fontSize:"0.75rem",color:"#8b949e",marginRight:6}}>Case Type:</span>
          {Object.entries(REASON_LABELS).map(([k,v])=>(
            <button key={k} style={styles.btn(ctype===k)} onClick={()=>setCtype(k)}>{v}</button>
          ))}
        </div>
        <div>
          <span style={{fontSize:"0.75rem",color:"#8b949e",marginRight:6}}>Median:</span>
          <button style={styles.btn(medMode==="raw")} onClick={()=>setMedMode("raw")}>Raw</button>
          <button style={styles.btn(medMode==="adj")} onClick={()=>setMedMode("adj")}>Adjusted</button>
        </div>
      </div>

      {/* Summary cards */}
      <div style={styles.cards}>
        {[
          {label:"Open (live)", val:totals.open, sub:"All open cases"},
          {label:`>30d Open`, val:totals.a30, sub:"Aged backlog"},
          {label:`>100d Open`, val:totals.a100, sub:"Critical aged"},
          {label:`Closed ${THIS_WEEK}`, val:totals.cl7, sub:"This week"},
          {label:`Closed ${PREV_WEEK}`, val:totals.cp7, sub:"Prior week"},
          {label:`New ${THIS_WEEK}`, val:totals.n7, sub:"Opened this week"},
        ].map(c=>(
          <div key={c.label} style={styles.card}>
            <div style={styles.cardLbl}>{c.label}</div>
            <div style={styles.cardVal}>{c.val}</div>
            <div style={styles.cardSub}>{c.sub}</div>
          </div>
        ))}
        <div style={styles.card}>
          <div style={styles.cardLbl}>Backlog WoW</div>
          <div style={styles.cardVal}>{totals.open - totals.openp7 >= 0 ? "+" : ""}{totals.open - totals.openp7}</div>
          <div style={styles.cardSub}>vs last week ({totals.openp7} open)</div>
        </div>
      </div>

      <div style={{overflowX:"auto"}}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Analyst</th>
              <th style={styles.th}>Region</th>
              <SortHdr col="open">Open</SortHdr>
              <SortHdr col="a30">&gt;30d 🔴</SortHdr>
              <SortHdr col="a100">&gt;100d</SortHdr>
              <th style={{...styles.th, textAlign:"right"}}>Backlog WoW</th>
              <SortHdr col="cl7">Closed {THIS_WEEK}</SortHdr>
              <SortHdr col="cp7">Closed {PREV_WEEK}</SortHdr>
              <th style={{...styles.th, textAlign:"right"}}>Close WoW</th>
              <SortHdr col="n7">New {THIS_WEEK}</SortHdr>
              <th style={{...styles.th, textAlign:"right"}}>New {PREV_WEEK}</th>
              <th style={{...styles.th, textAlign:"right"}}>New WoW</th>
              <SortHdr col="median">Median Days{medMode==="adj"?" (Adj)":""}</SortHdr>
            </tr>
          </thead>
          <tbody>
            {sorted.map(row => {
              const med = row[medKey][k];
              const medColor = med > 90 ? "#e55" : med > 45 ? "#fa0" : "#4c4";
              const wowOpen = row.open[k] - row.openp7;
              return (
                <tr key={row.name}>
                  <td style={styles.td}><strong>{row.name}</strong></td>
                  <td style={styles.td}><span style={{fontSize:"0.75rem",color:"#8b949e"}}>{row.region}</span></td>
                  <td style={styles.tdNum}>{row.open[k]}</td>
                  <td style={styles.tdNum}>{badge(row.a30[k],80,40)} {row.a30[k]}</td>
                  <td style={styles.tdNum}>{a100Badge(row.a100[k])} {row.a100[k]}</td>
                  <td style={styles.tdNum}>{wow(row.open[k], row.openp7)}</td>
                  <td style={styles.tdNum}>{row.cl7[k]}</td>
                  <td style={styles.tdNum}>{row.cp7[k]}</td>
                  <td style={styles.tdNum}>{closeWow(row.cl7[k], row.cp7[k])}</td>
                  <td style={styles.tdNum}>{row.n7[k]}</td>
                  <td style={styles.tdNum}>{row.np7[k]}</td>
                  <td style={styles.tdNum}>{wow(row.n7[k], row.np7[k])}</td>
                  <td style={styles.tdNum}>
                    <span style={{color:medColor, fontWeight:600}}>{med}d</span>
                    {row.mNote[k] && <span style={{fontSize:"0.7rem",color:"#8b949e"}}> *</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td style={styles.footL} colSpan={2}>Total</td>
              <td style={styles.foot}>{totals.open}</td>
              <td style={styles.foot}>{totals.a30}</td>
              <td style={styles.foot}>{totals.a100}</td>
              <td style={styles.foot}>{wow(totals.open, totals.openp7)}</td>
              <td style={styles.foot}>{totals.cl7}</td>
              <td style={styles.foot}>{totals.cp7}</td>
              <td style={styles.foot}>{closeWow(totals.cl7, totals.cp7)}</td>
              <td style={styles.foot}>{totals.n7}</td>
              <td style={styles.foot}>{totals.np7}</td>
              <td style={styles.foot}>{wow(totals.n7, totals.np7)}</td>
              <td style={styles.foot}>—</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div style={{marginTop:12,fontSize:"0.72rem",color:"#484f58"}}>
        * Median marked where &gt;100d cases may skew. Adjusted median excludes time in On Hold, FourKites Working, Awaiting Loads. Backlog WoW = open now vs est. open last week.
      </div>
    </div>
  );
}
