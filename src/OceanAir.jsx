import { useState, useMemo } from "react";

const LAST_REFRESHED = "October 21, 2026 · 4:00 PM CT";
const AS_OF = "October 21, 2026 — Medians freshly recomputed from full Jan–Oct 2026 Complete-only census (same corrected methodology as NG Team: Status→Complete only, null-reason excluded). Open/aged/closed/new counts are from the Sep 2 refresh and are now stale, due for a fresh live pull. Kept separate from the NG Team roster and NG Team summary totals.";
const THIS_WEEK = "Aug 26–Sep 1 (stale)";
const PREV_WEEK = "Aug 18–24";

// Johnny Mei (Lead Ocean & Air Carrier Onboarding) and Krishnasharmila R (Project Specialist)
// Excluded from the main NG Team dashboard and its Total/Team summary.
const OCEAN_AIR = [
  { name:"Johnny Mei", role:"Lead Ocean & Air Carrier Onboarding",
    open:{new:15,addon:65,update:5,all:105}, a30:{new:14,addon:57,update:5,all:88},
    a100:{new:13,addon:32,update:0,all:51},
    cl7:{new:0,addon:0,update:0,all:0}, cp7:{new:0,addon:0,update:0,all:0},
    n7:{new:1,addon:6,update:0,all:8}, np7:{new:0,addon:1,update:0,all:1},
    median:{new:0,addon:0,update:0,all:8}, medianAdj:{new:0,addon:0,update:0,all:6} },
  { name:"Krishnasharmila R", role:"Project Specialist",
    open:{new:25,addon:74,update:2,all:106}, a30:{new:20,addon:67,update:2,all:94},
    a100:{new:14,addon:52,update:1,all:70},
    cl7:{new:0,addon:0,update:0,all:1}, cp7:{new:2,addon:3,update:0,all:6},
    n7:{new:0,addon:0,update:0,all:1}, np7:{new:0,addon:0,update:0,all:0},
    median:{new:136,addon:141,update:23,all:120}, medianAdj:{new:121,addon:112,update:23,all:108} },
];

const TIME_BUCKETS_BY_TYPE = {"team": {"new": {"raw": {"0-10": 3, "11-20": 0, "21-30": 0, "31-50": 0, "50+": 3}, "adj": {"0-10": 3, "11-20": 0, "21-30": 0, "31-50": 0, "50+": 3}, "n": 6}, "addon": {"raw": {"0-10": 10, "11-20": 2, "21-30": 0, "31-50": 2, "50+": 14}, "adj": {"0-10": 12, "11-20": 2, "21-30": 1, "31-50": 2, "50+": 11}, "n": 28}, "update": {"raw": {"0-10": 2, "11-20": 0, "21-30": 0, "31-50": 1, "50+": 0}, "adj": {"0-10": 2, "11-20": 0, "21-30": 0, "31-50": 1, "50+": 0}, "n": 3}, "all": {"raw": {"0-10": 16, "11-20": 3, "21-30": 0, "31-50": 5, "50+": 20}, "adj": {"0-10": 18, "11-20": 3, "21-30": 1, "31-50": 5, "50+": 17}, "n": 44}}, "byAnalyst": {"Johnny Mei": {"new": {"raw": {"0-10": 3, "11-20": 0, "21-30": 0, "31-50": 0, "50+": 0}, "adj": {"0-10": 3, "11-20": 0, "21-30": 0, "31-50": 0, "50+": 0}, "n": 3}, "addon": {"raw": {"0-10": 10, "11-20": 2, "21-30": 0, "31-50": 2, "50+": 5}, "adj": {"0-10": 12, "11-20": 2, "21-30": 0, "31-50": 2, "50+": 3}, "n": 19}, "update": {"raw": {"0-10": 1, "11-20": 0, "21-30": 0, "31-50": 0, "50+": 0}, "adj": {"0-10": 1, "11-20": 0, "21-30": 0, "31-50": 0, "50+": 0}, "n": 1}, "all": {"raw": {"0-10": 15, "11-20": 3, "21-30": 0, "31-50": 3, "50+": 8}, "adj": {"0-10": 17, "11-20": 3, "21-30": 0, "31-50": 3, "50+": 6}, "n": 29}}, "Krishnasharmila R": {"new": {"raw": {"0-10": 0, "11-20": 0, "21-30": 0, "31-50": 0, "50+": 3}, "adj": {"0-10": 0, "11-20": 0, "21-30": 0, "31-50": 0, "50+": 3}, "n": 3}, "addon": {"raw": {"0-10": 0, "11-20": 0, "21-30": 0, "31-50": 0, "50+": 9}, "adj": {"0-10": 0, "11-20": 0, "21-30": 1, "31-50": 0, "50+": 8}, "n": 9}, "update": {"raw": {"0-10": 1, "11-20": 0, "21-30": 0, "31-50": 1, "50+": 0}, "adj": {"0-10": 1, "11-20": 0, "21-30": 0, "31-50": 1, "50+": 0}, "n": 2}, "all": {"raw": {"0-10": 1, "11-20": 0, "21-30": 0, "31-50": 2, "50+": 12}, "adj": {"0-10": 1, "11-20": 0, "21-30": 1, "31-50": 2, "50+": 11}, "n": 15}}}};

// Real week-on-week data, binned by actual ClosedDate (ISO week). Volume is thin here
// (44 cases over 10 months) - many weeks show 0-3 cases. Read this chart as a rough signal, not a precise trend.
const WEEKLY_BUCKET_LABELS = ["2026-02-02", "2026-02-09", "2026-03-02", "2026-03-23", "2026-03-30", "2026-04-27", "2026-05-04", "2026-05-11", "2026-05-18", "2026-06-08", "2026-06-15", "2026-06-22", "2026-06-29", "2026-07-06", "2026-07-13", "2026-08-03", "2026-08-17", "2026-09-28", "2026-10-05", "2026-10-12"];
const WEEKLY_BUCKET_DATA = [{"n": 1, "0-10": 0, "11-20": 1, "21-30": 0, "31-50": 0, "50+": 0}, {"n": 1, "0-10": 0, "11-20": 0, "21-30": 0, "31-50": 1, "50+": 0}, {"n": 1, "0-10": 0, "11-20": 1, "21-30": 0, "31-50": 0, "50+": 0}, {"n": 2, "0-10": 0, "11-20": 1, "21-30": 0, "31-50": 0, "50+": 1}, {"n": 2, "0-10": 0, "11-20": 0, "21-30": 0, "31-50": 0, "50+": 2}, {"n": 1, "0-10": 0, "11-20": 0, "21-30": 0, "31-50": 1, "50+": 0}, {"n": 1, "0-10": 1, "11-20": 0, "21-30": 0, "31-50": 0, "50+": 0}, {"n": 2, "0-10": 1, "11-20": 0, "21-30": 0, "31-50": 0, "50+": 1}, {"n": 1, "0-10": 0, "11-20": 0, "21-30": 0, "31-50": 0, "50+": 1}, {"n": 2, "0-10": 2, "11-20": 0, "21-30": 0, "31-50": 0, "50+": 0}, {"n": 2, "0-10": 1, "11-20": 0, "21-30": 0, "31-50": 0, "50+": 1}, {"n": 1, "0-10": 1, "11-20": 0, "21-30": 0, "31-50": 0, "50+": 0}, {"n": 2, "0-10": 0, "11-20": 0, "21-30": 0, "31-50": 0, "50+": 2}, {"n": 2, "0-10": 0, "11-20": 0, "21-30": 0, "31-50": 1, "50+": 1}, {"n": 3, "0-10": 2, "11-20": 0, "21-30": 0, "31-50": 0, "50+": 1}, {"n": 7, "0-10": 0, "11-20": 0, "21-30": 0, "31-50": 2, "50+": 5}, {"n": 5, "0-10": 1, "11-20": 0, "21-30": 0, "31-50": 0, "50+": 4}, {"n": 3, "0-10": 3, "11-20": 0, "21-30": 0, "31-50": 0, "50+": 0}, {"n": 2, "0-10": 2, "11-20": 0, "21-30": 0, "31-50": 0, "50+": 0}, {"n": 3, "0-10": 2, "11-20": 0, "21-30": 0, "31-50": 0, "50+": 1}];

export default function OceanAir() {
  const [ctype, setCtype] = useState("all");
  const [medMode, setMedMode] = useState("raw");
  const [showBuckets, setShowBuckets] = useState(false);
  const [showWeekly, setShowWeekly] = useState(false);

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
        <button style={{...s.btn(showBuckets),marginLeft:16}} onClick={()=>setShowBuckets(t=>!t)}>
          {showBuckets ? "Hide Time Buckets" : "⏱️ Show Time-to-Close Buckets"}
        </button>
        <button style={s.btn(showWeekly)} onClick={()=>setShowWeekly(t=>!t)}>
          {showWeekly ? "Hide Weekly Trend" : "📅 Show Weekly Trend"}
        </button>
      </div>

      {showBuckets && (() => {
        const bk = medMode === "raw" ? "raw" : "adj";
        const teamB = TIME_BUCKETS_BY_TYPE.team[ctype][bk];
        const teamN = TIME_BUCKETS_BY_TYPE.team[ctype].n;
        const bucketOrder = ["0-10","11-20","21-30","31-50","50+"];
        return (
        <div style={{background:"#161b22",border:"1px solid #30363d",borderRadius:8,padding:"16px",marginBottom:20,overflowX:"auto"}}>
          <div style={{fontSize:"0.85rem",fontWeight:600,color:"#58a6ff",marginBottom:4}}>
            ⏱️ Time-to-Close Distribution — {ctype==="new"?"New":ctype==="addon"?"Add-on":ctype==="update"?"Update":"All"} cases, {medMode==="raw"?"Raw":"Adjusted"} days
          </div>
          <div style={{fontSize:"0.7rem",color:"#484f58",marginBottom:12}}>
            Full Jan–Oct 2026 Complete-only census, n={teamN} total. Small sample for this team (Ocean/Air is much lower volume than NG Team) — read percentages cautiously.
          </div>
          <table style={{...s.table,fontSize:"0.8rem"}}>
            <thead><tr>
              <th style={s.th}>Analyst</th><th style={s.thRight}>n</th>
              {bucketOrder.map((b,i)=><th key={b} style={{...s.thRight,borderRight:i===1?"2px solid #58a6ff":undefined}}>{b}d</th>)}
            </tr></thead>
            <tbody>
              {OCEAN_AIR.map(row=>{
                const d = TIME_BUCKETS_BY_TYPE.byAnalyst[row.name]?.[ctype];
                if (!d) return null;
                const db = d[bk];
                return (
                  <tr key={row.name}>
                    <td style={s.td}>{row.name}</td>
                    <td style={s.tdRight}>{d.n}</td>
                    {bucketOrder.map((b,i)=>{
                      const cnt = db[b]; const pct = d.n ? Math.round(100*cnt/d.n) : 0;
                      return <td key={b} style={{...s.tdRight,borderRight:i===1?"2px solid #58a6ff":undefined}}>{cnt} <span style={{color:"#8b949e",fontSize:"0.72rem"}}>({pct}%)</span></td>;
                    })}
                  </tr>
                );
              })}
              <tr style={s.totalRow}>
                <td style={s.td}>Team Total</td><td style={s.tdRight}>{teamN}</td>
                {bucketOrder.map((b,i)=>{
                  const cnt = teamB[b]; const pct = teamN ? Math.round(100*cnt/teamN) : 0;
                  return <td key={b} style={{...s.tdRight,borderRight:i===1?"2px solid #58a6ff":undefined}}>{cnt} <span style={{fontWeight:400,fontSize:"0.72rem"}}>({pct}%)</span></td>;
                })}
              </tr>
            </tbody>
          </table>
        </div>
        );
      })()}

      {showWeekly && (() => {
        const segs = [["0-10","#2a9d8f"],["11-20","#4cb8a8"],["21-30","#d9b354"],["31-50","#e08f4a"],["50+","#e05a4a"]];
        const maxN = Math.max(1, ...WEEKLY_BUCKET_DATA.map(w=>w.n));
        return (
        <div style={{background:"#161b22",border:"1px solid #30363d",borderRadius:8,padding:"16px",marginBottom:20,overflowX:"auto"}}>
          <div style={{fontSize:"0.85rem",fontWeight:600,color:"#58a6ff",marginBottom:4}}>
            📅 Weekly Time-to-Close Trend — Ocean/Air team-wide, Raw days
          </div>
          <div style={{fontSize:"0.7rem",color:"#fa0",marginBottom:12}}>
            ⚠️ Volume is thin here — only 44 cases total over {WEEKLY_BUCKET_LABELS.length} weeks with any activity, often 1-3 cases/week. Treat this as a rough signal, not a precise trend. Hover a bar for the exact weekly count.
          </div>
          <div style={{position:"relative",height:220,minWidth:WEEKLY_BUCKET_LABELS.length*16,paddingBottom:4}}>
            <div style={{display:"flex",alignItems:"flex-end",gap:3,height:200,position:"absolute",left:0,top:0}}>
              {WEEKLY_BUCKET_DATA.map((w,i)=>{
                const n = w.n || 1;
                const tooltip = `Week of ${WEEKLY_BUCKET_LABELS[i]} (n=${w.n})\n0-10d: ${w["0-10"]}\n11-20d: ${w["11-20"]}\n21-30d: ${w["21-30"]}\n31-50d: ${w["31-50"]}\n50+d: ${w["50+"]}`;
                return (
                  <div key={i} title={tooltip} style={{display:"flex",flexDirection:"column-reverse",width:12,height:200,flexShrink:0,borderRadius:"2px 2px 0 0",overflow:"hidden",cursor:"default"}}>
                    {segs.map(([k,color])=>(
                      <div key={k} style={{height:w.n?`${100*w[k]/n}%`:"0%",background:color,width:"100%"}} />
                    ))}
                  </div>
                );
              })}
            </div>
            {(() => {
              const step = 15, chartH = 200, topPad = 10;
              const pts = WEEKLY_BUCKET_DATA.map((w,i)=>({x:i*step+6, y:chartH-topPad-(w.n/maxN)*(chartH-topPad*2), n:w.n}));
              const pathD = pts.map((p,i)=>`${i===0?'M':'L'} ${p.x} ${p.y}`).join(' ');
              return (
                <svg width={WEEKLY_BUCKET_DATA.length*step} height={chartH} style={{position:"absolute",left:0,top:0,pointerEvents:"none",overflow:"visible"}}>
                  <path d={pathD} fill="none" stroke="#58a6ff" strokeWidth={2} strokeLinejoin="round" opacity={0.9} />
                  {pts.map((p,i)=>(<circle key={i} cx={p.x} cy={p.y} r={2.5} fill="#58a6ff" opacity={0.9}><title>{`Week of ${WEEKLY_BUCKET_LABELS[i]}: ${p.n} closed`}</title></circle>))}
                </svg>
              );
            })()}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.65rem",color:"#484f58",marginTop:4,minWidth:WEEKLY_BUCKET_LABELS.length*16}}>
            <span>{WEEKLY_BUCKET_LABELS[0]}</span>
            <span>{WEEKLY_BUCKET_LABELS[WEEKLY_BUCKET_LABELS.length-1]}</span>
          </div>
          <div style={{display:"flex",gap:16,marginTop:12,flexWrap:"wrap"}}>
            {segs.map(([label,color])=>(
              <div key={label} style={{display:"flex",alignItems:"center",gap:6,fontSize:"0.72rem",color:"#8b949e"}}>
                <div style={{width:10,height:10,background:color,borderRadius:2}} />{label}d
              </div>
            ))}
            <div style={{display:"flex",alignItems:"center",gap:6,fontSize:"0.72rem",color:"#58a6ff"}}>
              <div style={{width:16,height:2,background:"#58a6ff"}} />Total closed that week
            </div>
          </div>
        </div>
        );
      })()}

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
