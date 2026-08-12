import { useState, useMemo } from "react";

const LAST_REFRESHED = "August 12, 2026 · 7:35 AM CT";
const AS_OF = "August 12, 2026 — Live from Salesforce (open/aged/closed/new, trailing 7d); medians from full Jan 1, 2026+ closed-case census, null-reason excluded. Kept separate from the NG Team roster and NG Team summary totals.";
const THIS_WEEK = "Aug 6–12";
const PREV_WEEK = "Aug 1–7";

// Johnny Mei (Lead Ocean & Air Carrier Onboarding) and Krishnasharmila R (Project Specialist)
// Excluded from the main NG Team dashboard and its Total/Team summary.
const OCEAN_AIR = [
  { name:"Johnny Mei", role:"Lead Ocean & Air Carrier Onboarding",
    open:{new:14,addon:57,update:5,all:90}, a30:{new:13,addon:53,update:2,all:80},
    a100:{new:10,addon:28,update:0,all:45},
    cl7:{new:0,addon:1,update:0,all:1}, cp7:{new:0,addon:0,update:0,all:0},
    n7:{new:0,addon:0,update:0,all:0}, np7:{new:0,addon:0,update:1,all:1},
    median:{new:0,addon:3,update:28,all:14}, medianAdj:{new:0,addon:3,update:28,all:6} },
  { name:"Krishnasharmila R", role:"Project Specialist",
    open:{new:21,addon:66,update:2,all:94}, a30:{new:19,addon:61,update:2,all:87},
    a100:{new:10,addon:30,update:1,all:44},
    cl7:{new:2,addon:3,update:0,all:6}, cp7:{new:0,addon:0,update:0,all:0},
    n7:{new:0,addon:0,update:0,all:0}, np7:{new:0,addon:0,update:0,all:0},
    median:{new:43,addon:50,update:23,all:43}, medianAdj:{new:29,addon:43,update:23,all:43} },
];

export default function OceanAir() {
  const [ctype, setCtype] = useState("all");
  const [medMode, setMedMode] = useState("raw");

  const medKey = medMode==="raw" ? "median" : "medianAdj";

  const totals = useMemo(() => {
    const sum = (k) => OCEAN_AIR.reduce((a,r)=>a+r[k][ctype],0);
    const medVals = OCEAN_AIR.map(r=>r[medKey][ctype]).filter(v=>v!=null && v>0);
    const teamMed = medVals.length
      ? Math.round(medVals.length%2===0
          ? (medVals.sort((a,b)=>a-b)[medVals.length/2-1]+medVals.sort((a,b)=>a-b)[medVals.length/2])/2
          : medVals.sort((a,b)=>a-b)[Math.floor(medVals.length/2)])
      : 0;
    return {
      open: sum("open"), a30: sum("a30"), a100: sum("a100"),
      cl7: sum("cl7"), cp7: sum("cp7"), n7: sum("n7"),
      med: teamMed,
    };
  }, [ctype, medKey]);

  const s = {
    h1: {fontSize:"1.4rem",fontWeight:700,margin:0,color:"#58a6ff"},
    asOf: {fontSize:"0.75rem",color:"#8b949e",marginTop:4,maxWidth:900},
    lastRefreshed: {fontSize:"0.95rem",color:"#58a6ff",fontWeight:700,marginTop:2},
    filt: {display:"flex",gap:12,flexWrap:"wrap",marginBottom:18,alignItems:"center"},
    btn: (a)=>({padding:"5px 14px",borderRadius:6,border:"1px solid #30363d",
      background:a?"#1f6feb":"#161b22",color:a?"#fff":"#c9d1d9",cursor:"pointer",fontSize:"0.82rem"}),
    label: {fontSize:"0.78rem",color:"#8b949e",marginRight:4},
    cards: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:20},
    card: {background:"#161b22",border:"1px solid #30363d",borderRadius:8,padding:"12px 16px"},
    cardLabel: {fontSize:"0.75rem",color:"#8b949e"},
    cardVal: {fontSize:"1.6rem",fontWeight:700,marginTop:2},
    cardSub: {fontSize:"0.72rem",color:"#8b949e",marginTop:2},
    table: {width:"100%",borderCollapse:"collapse",fontSize:"0.85rem"},
    th: {padding:"6px 10px",background:"#1e2a45",textAlign:"left",whiteSpace:"nowrap"},
    thRight: {padding:"6px 10px",background:"#1e2a45",textAlign:"right",whiteSpace:"nowrap"},
    td: {padding:"6px 10px",borderBottom:"1px solid #21262d"},
    tdRight: {padding:"6px 10px",borderBottom:"1px solid #21262d",textAlign:"right"},
    totalRow: {background:"#161b22",fontWeight:700},
  };

  return (
    <div>
      <div style={{marginBottom:20}}>
        <h1 style={s.h1}>🚢 Ocean/Air Dashboard</h1>
        <div style={s.lastRefreshed}>🕒 Last refreshed: {LAST_REFRESHED}</div>
        <div style={s.asOf}>As of {AS_OF} &nbsp;·&nbsp; Week: {THIS_WEEK} &nbsp;·&nbsp; Prev: {PREV_WEEK}</div>
      </div>

      <div style={s.filt}>
        <span style={s.label}>Case Type:</span>
        {["new","addon","update","all"].map(k=>(
          <button key={k} style={s.btn(ctype===k)} onClick={()=>setCtype(k)}>
            {k==="new"?"New":k==="addon"?"Add-on":k==="update"?"Update":"All"}
          </button>
        ))}
        <span style={{...s.label,marginLeft:16}}>Median:</span>
        <button style={s.btn(medMode==="raw")} onClick={()=>setMedMode("raw")}>Raw</button>
        <button style={s.btn(medMode==="adj")} onClick={()=>setMedMode("adj")}>Adjusted</button>
      </div>

      <div style={s.cards}>
        <div style={s.card}><div style={s.cardLabel}>Open (live)</div><div style={s.cardVal}>{totals.open}</div><div style={s.cardSub}>Ocean/Air open cases</div></div>
        <div style={s.card}><div style={s.cardLabel}>&gt;30d Open</div><div style={s.cardVal}>{totals.a30}</div><div style={s.cardSub}>Aged backlog</div></div>
        <div style={s.card}><div style={s.cardLabel}>&gt;100d Open</div><div style={s.cardVal}>{totals.a100}</div><div style={s.cardSub}>Critical aged</div></div>
        <div style={s.card}><div style={s.cardLabel}>Closed {THIS_WEEK}</div><div style={s.cardVal}>{totals.cl7}</div><div style={s.cardSub}>This week</div></div>
        <div style={s.card}><div style={s.cardLabel}>New {THIS_WEEK}</div><div style={s.cardVal}>{totals.n7}</div><div style={s.cardSub}>Opened this week</div></div>
        <div style={s.card}><div style={s.cardLabel}>Median Days to Close</div><div style={s.cardVal}>{totals.med}d</div><div style={s.cardSub}>Ocean/Air only — not part of NG Team total</div></div>
      </div>

      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Analyst</th>
            <th style={s.th}>Role</th>
            <th style={s.thRight}>Open</th>
            <th style={s.thRight}>&gt;30d</th>
            <th style={s.thRight}>&gt;100d</th>
            <th style={s.thRight}>Closed {THIS_WEEK}</th>
            <th style={s.thRight}>New {THIS_WEEK}</th>
            <th style={s.thRight}>Median</th>
          </tr>
        </thead>
        <tbody>
          {OCEAN_AIR.map(r => (
            <tr key={r.name}>
              <td style={s.td}>{r.name}</td>
              <td style={s.td}>{r.role}</td>
              <td style={s.tdRight}>{r.open[ctype]}</td>
              <td style={s.tdRight}>{r.a30[ctype]}</td>
              <td style={s.tdRight}>{r.a100[ctype]}</td>
              <td style={s.tdRight}>{r.cl7[ctype]}</td>
              <td style={s.tdRight}>{r.n7[ctype]}</td>
              <td style={s.tdRight}>{r[medKey][ctype] || "—"}{r[medKey][ctype] ? "d" : ""}</td>
            </tr>
          ))}
          <tr style={s.totalRow}>
            <td style={s.td}>Total / Ocean-Air</td>
            <td style={s.td}></td>
            <td style={s.tdRight}>{totals.open}</td>
            <td style={s.tdRight}>{totals.a30}</td>
            <td style={s.tdRight}>{totals.a100}</td>
            <td style={s.tdRight}>{totals.cl7}</td>
            <td style={s.tdRight}>{totals.n7}</td>
            <td style={s.tdRight}>{totals.med}d</td>
          </tr>
        </tbody>
      </table>
      <div style={{fontSize:"0.72rem",color:"#8b949e",marginTop:10}}>
        This roster (Johnny Mei, Krishnasharmila R) is excluded from the NG Team tab and its Total/Team summary — their medians and counts are calculated independently here.
      </div>
    </div>
  );
}
