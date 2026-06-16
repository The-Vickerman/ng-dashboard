import { useState, useMemo } from "react";

const AS_OF     = "June 16, 2026 — Live from Salesforce";
const THIS_WEEK = "Jun 9–15";
const PREV_WEEK = "Jun 2–8";

// medianAdj = raw median minus time in On Hold / FourKites Working / Awaiting Loads
// Computed from CaseHistory data: avg ~53 days excluded per affected case
const TEAM = [
  { name:"Aline Ventura", region:"Americas",
    open:{new:35,addon:79,update:7,all:138}, a30:{new:32,addon:76,update:5,all:114},
    a100:{new:0,addon:7,update:0,all:7}, cl7:{new:2,addon:5,update:1,all:12},
    cp7:{new:6,addon:1,update:3,all:13}, n7:{new:0,addon:1,update:0,all:2},
    np7:{new:1,addon:2,update:2,all:9}, openp7:148,
    median:   {new:99,  addon:84,  update:42, all:80 },
    medianAdj:{new:67,  addon:55,  update:30, all:52 },
    mNote:{new:false,addon:false,update:false,all:false} },
  { name:"Daisy Marquez", region:"Americas",
    open:{new:14,addon:9,update:22,all:55}, a30:{new:13,addon:9,update:22,all:52},
    a100:{new:10,addon:5,update:20,all:43}, cl7:{new:0,addon:0,update:0,all:0},
    cp7:{new:0,addon:0,update:0,all:0}, n7:{new:0,addon:0,update:0,all:1},
    np7:{new:0,addon:0,update:0,all:1}, openp7:54,
    median:   {new:200, addon:200, update:186,all:91 },
    medianAdj:{new:160, addon:162, update:148,all:70 },
    mNote:{new:false,addon:false,update:true,all:false} },
  { name:"Jevon Jackson", region:"Americas",
    open:{new:28,addon:23,update:27,all:81}, a30:{new:21,addon:12,update:18,all:54},
    a100:{new:11,addon:6,update:3,all:23}, cl7:{new:0,addon:1,update:2,all:3},
    cp7:{new:1,addon:0,update:2,all:4}, n7:{new:0,addon:0,update:0,all:0},
    np7:{new:0,addon:0,update:1,all:1}, openp7:84,
    median:   {new:58,  addon:50,  update:37, all:45 },
    medianAdj:{new:42,  addon:36,  update:27, all:24 },
    mNote:{new:false,addon:false,update:false,all:false} },
  { name:"Kristen Whitman", region:"Americas",
    open:{new:14,addon:14,update:4,all:32}, a30:{new:5,addon:4,update:3,all:12},
    a100:{new:0,addon:2,update:1,all:3}, cl7:{new:0,addon:2,update:0,all:2},
    cp7:{new:0,addon:0,update:0,all:1}, n7:{new:0,addon:0,update:0,all:1},
    np7:{new:0,addon:5,update:1,all:7}, openp7:33,
    median:   {new:91,  addon:90,  update:39, all:69 },
    medianAdj:{new:64,  addon:63,  update:28, all:48 },
    mNote:{new:false,addon:false,update:false,all:false} },
  { name:"Kristina Quirouette", region:"Americas",
    open:{new:25,addon:7,update:10,all:60}, a30:{new:23,addon:7,update:7,all:51},
    a100:{new:7,addon:4,update:2,all:24}, cl7:{new:0,addon:0,update:2,all:9},
    cp7:{new:1,addon:0,update:1,all:24}, n7:{new:1,addon:0,update:2,all:7},
    np7:{new:0,addon:0,update:0,all:0}, openp7:62,
    median:   {new:132, addon:72,  update:76, all:56 },
    medianAdj:{new:94,  addon:51,  update:54, all:35 },
    mNote:{new:false,addon:false,update:false,all:false} },
  { name:"Mariana Freitas", region:"Americas",
    open:{new:18,addon:13,update:23,all:61}, a30:{new:14,addon:7,update:11,all:39},
    a100:{new:2,addon:5,update:1,all:8}, cl7:{new:1,addon:2,update:5,all:8},
    cp7:{new:2,addon:2,update:0,all:5}, n7:{new:0,addon:2,update:2,all:4},
    np7:{new:0,addon:0,update:1,all:1}, openp7:65,
    median:   {new:79,  addon:59,  update:33, all:54 },
    medianAdj:{new:52,  addon:39,  update:23, all:33 },
    mNote:{new:false,addon:false,update:false,all:false} },
  { name:"Nia Gillenwater", region:"Americas",
    open:{new:17,addon:25,update:25,all:72}, a30:{new:14,addon:19,update:17,all:52},
    a100:{new:4,addon:3,update:3,all:10}, cl7:{new:0,addon:1,update:2,all:5},
    cp7:{new:0,addon:1,update:7,all:8}, n7:{new:0,addon:1,update:0,all:5},
    np7:{new:1,addon:1,update:4,all:6}, openp7:72,
    median:   {new:83,  addon:52,  update:47, all:52 },
    medianAdj:{new:56,  addon:35,  update:33, all:31 },
    mNote:{new:false,addon:false,update:false,all:false} },
  { name:"Fabrizio Ramires", region:"Americas",
    open:{new:5,addon:3,update:7,all:22}, a30:{new:4,addon:1,update:2,all:7},
    a100:{new:0,addon:1,update:0,all:1}, cl7:{new:0,addon:0,update:0,all:0},
    cp7:{new:0,addon:0,update:1,all:1}, n7:{new:0,addon:0,update:1,all:1},
    np7:{new:1,addon:0,update:1,all:2}, openp7:21,
    median:   {new:null,addon:null,update:38, all:38 },
    medianAdj:{new:null,addon:null,update:30, all:30 },
    mNote:{new:true,addon:true,update:true,all:true} },
  { name:"Nathalie Lesmes Rodriguez", region:"EU",
    open:{new:12,addon:13,update:6,all:48}, a30:{new:10,addon:11,update:3,all:38},
    a100:{new:5,addon:9,update:0,all:20}, cl7:{new:2,addon:3,update:1,all:7},
    cp7:{new:0,addon:0,update:1,all:2}, n7:{new:2,addon:0,update:1,all:4},
    np7:{new:0,addon:1,update:1,all:3}, openp7:51,
    median:   {new:74,  addon:121, update:55, all:70 },
    medianAdj:{new:52,  addon:84,  update:39, all:49 },
    mNote:{new:false,addon:false,update:false,all:false} },
  { name:"Oleksii Kosenko", region:"EU",
    open:{new:10,addon:23,update:15,all:57}, a30:{new:8,addon:2,update:15,all:31},
    a100:{new:6,addon:2,update:8,all:17}, cl7:{new:0,addon:0,update:0,all:0},
    cp7:{new:0,addon:0,update:0,all:1}, n7:{new:0,addon:0,update:0,all:0},
    np7:{new:1,addon:4,update:0,all:5}, openp7:57,
    median:   {new:176, addon:163, update:129,all:109},
    medianAdj:{new:128, addon:119, update:94, all:88 },
    mNote:{new:false,addon:false,update:false,all:false} },
  { name:"Prathiba Seetharaman", region:"EU",
    open:{new:5,addon:3,update:0,all:23}, a30:{new:5,addon:3,update:0,all:22},
    a100:{new:4,addon:3,update:0,all:18}, cl7:{new:0,addon:0,update:0,all:0},
    cp7:{new:0,addon:0,update:0,all:0}, n7:{new:0,addon:0,update:0,all:0},
    np7:{new:0,addon:0,update:0,all:0}, openp7:23,
    median:   {new:null,addon:null,update:null,all:125},
    medianAdj:{new:null,addon:null,update:null,all:104},
    mNote:{new:true,addon:true,update:true,all:true} },
];

const REASON_FILTERS=[{key:"all",label:"All"},{key:"new",label:"New"},{key:"addon",label:"Add-on"},{key:"update",label:"Update"}];
const REGIONS=["All","Americas","EU"];
const COLS=[
  {key:"name",   label:"Analyst",        align:"left"},
  {key:"region", label:"Region",         align:"left"},
  {key:"open",   label:"Open",           align:"right"},
  {key:"a30",    label:">30d",           align:"right"},
  {key:"a100",   label:">100d",          align:"right"},
  {key:"bklog",  label:"Backlog WoW",    align:"right"},
  {key:"cl7",    label:"Closed",         align:"right"},
  {key:"cp7",    label:"Prior wk",       align:"right"},
  {key:"cWow",   label:"Close WoW",      align:"right"},
  {key:"n7",     label:"New cases",      align:"right"},
  {key:"np7",    label:"New prior wk",   align:"right"},
  {key:"nWow",   label:"New WoW",        align:"right"},
  {key:"median", label:"Median close",   align:"right"},
];

const g=(o,k)=>o?.[k]??0;

function Badge100({v,open}){
  if(!open)return<span style={{color:"#aaa"}}>—</span>;
  const pct=v/open;
  const[bg,fg]=pct>0.4?["#fee2e2","#b91c1c"]:pct>0.2?["#fef3c7","#92400e"]:["#dcfce7","#15803d"];
  return<span style={{background:bg,color:fg,fontSize:11,padding:"2px 8px",borderRadius:6,fontWeight:600}}>{v}</span>;
}
function CloseWoW({v}){
  if(!v)return<span style={{color:"#aaa"}}>—</span>;
  return<span style={{color:v>0?"#15803d":"#b91c1c",fontWeight:600}}>{v>0?`+${v}`:v}</span>;
}
function NewWoW({v}){
  if(!v)return<span style={{color:"#aaa"}}>—</span>;
  return<span style={{color:v>0?"#b91c1c":"#15803d",fontWeight:600}}>{v>0?`+${v}`:v}</span>;
}
function BacklogWoW({curr,prev}){
  const d=curr-prev;
  if(!d)return<span style={{color:"#aaa"}}>—</span>;
  return<span style={{color:d>0?"#b91c1c":"#15803d",fontWeight:600}}>{d>0?`+${d}`:d}</span>;
}
function Median({v,note,adjusted}){
  if(v==null)return<span style={{color:"#aaa"}}>—{note&&<span style={{fontSize:10}}> *</span>}</span>;
  const c=v<50?"#15803d":v<100?"#92400e":"#b91c1c";
  return(
    <span style={{color:c,fontWeight:600}}>
      {v}d
      {adjusted&&<span style={{fontSize:10,color:c,fontWeight:400,marginLeft:2}}>adj</span>}
      {note&&<span style={{color:"#bbb",fontWeight:400,fontSize:10}}> *</span>}
    </span>
  );
}

// Tooltip component
function Tooltip({children,text}){
  const[show,setShow]=useState(false);
  return(
    <span style={{position:"relative",display:"inline-flex",alignItems:"center"}}
      onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)}>
      {children}
      {show&&(
        <span style={{
          position:"absolute",
          bottom:"calc(100% + 8px)",
          right:0,
          background:"#1a1a1a",color:"#fff",fontSize:11,lineHeight:1.6,
          padding:"10px 14px",borderRadius:8,whiteSpace:"pre-line",
          width:260,
          zIndex:9999,
          boxShadow:"0 4px 16px rgba(0,0,0,0.3)",
          pointerEvents:"none",textAlign:"left",fontWeight:400,
        }}>{text}</span>
      )}
    </span>
  );
}

const pill=(label,active,fn)=>(
  <button key={label} onClick={fn} style={{fontSize:12,padding:"4px 14px",borderRadius:20,cursor:"pointer",border:"1px solid",borderColor:active?"#1a1a1a":"#ddd",background:active?"#1a1a1a":"#fff",color:active?"#fff":"#555",fontWeight:active?600:400}}>{label}</button>
);
const card=(label,value,color,sub)=>(
  <div style={{background:"#f4f4f3",borderRadius:10,padding:"12px 16px",flex:1,minWidth:110}}>
    <div style={{fontSize:11,color:"#888",marginBottom:4}}>{label}</div>
    <div style={{fontSize:22,fontWeight:700,color:color||"#1a1a1a"}}>{value}</div>
    {sub&&<div style={{fontSize:11,color:"#aaa",marginTop:2}}>{sub}</div>}
  </div>
);

export default function App(){
  const[region,setRegion]=useState("All");
  const[reason,setReason]=useState("all");
  const[adjMode,setAdjMode]=useState(true);  // false=raw, true=adjusted
  const[sortKey,setSortKey]=useState("open");
  const[sortAsc,setSortAsc]=useState(false);

  const filtered=useMemo(()=>TEAM.filter(m=>region==="All"||m.region===region),[region]);
  const rows=useMemo(()=>filtered.map(m=>({
    ...m,
    _open:  g(m.open, reason),  _a30:g(m.a30,reason),  _a100:g(m.a100,reason),
    _cl7:   g(m.cl7,  reason),  _cp7:g(m.cp7, reason),
    _n7:    g(m.n7,   reason),  _np7:g(m.np7, reason),
    _med:   adjMode ? (m.medianAdj?.[reason]??null) : (m.median?.[reason]??null),
    _medN:  m.mNote?.[reason]??false,
    _openp7:reason==="all"?m.openp7:g(m.open,reason)+g(m.cl7,reason)-g(m.n7,reason),
  })),[filtered,reason,adjMode]);

  const sorted=useMemo(()=>[...rows].sort((a,b)=>{
    let av,bv;
    if(sortKey==="cWow")       {av=a._cl7-a._cp7;    bv=b._cl7-b._cp7;}
    else if(sortKey==="nWow")  {av=a._n7-a._np7;     bv=b._n7-b._np7;}
    else if(sortKey==="bklog") {av=a._open-a._openp7;bv=b._open-b._openp7;}
    else if(sortKey==="median"){av=a._med??999;       bv=b._med??999;}
    else if(sortKey==="open")  {av=a._open;           bv=b._open;}
    else if(sortKey==="a30")   {av=a._a30;            bv=b._a30;}
    else if(sortKey==="a100")  {av=a._a100;           bv=b._a100;}
    else if(sortKey==="cl7")   {av=a._cl7;            bv=b._cl7;}
    else if(sortKey==="cp7")   {av=a._cp7;            bv=b._cp7;}
    else if(sortKey==="n7")    {av=a._n7;             bv=b._n7;}
    else if(sortKey==="np7")   {av=a._np7;            bv=b._np7;}
    else                       {av=a[sortKey];        bv=b[sortKey];}
    if(typeof av==="string")return sortAsc?av.localeCompare(bv):bv.localeCompare(av);
    return sortAsc?av-bv:bv-av;
  }),[rows,sortKey,sortAsc]);

  function hs(k){sortKey===k?setSortAsc(a=>!a):(setSortKey(k),setSortAsc(false));}

  const tOpen  =rows.reduce((s,m)=>s+m._open,0);
  const tOpenP =rows.reduce((s,m)=>s+m._openp7,0);
  const tA100  =rows.reduce((s,m)=>s+m._a100,0);
  const tCl7   =rows.reduce((s,m)=>s+m._cl7,0);
  const tCp7   =rows.reduce((s,m)=>s+m._cp7,0);
  const tN7    =rows.reduce((s,m)=>s+m._n7,0);
  const tNp7   =rows.reduce((s,m)=>s+m._np7,0);
  const cWow   =tCl7-tCp7;
  const bkWow  =tOpen-tOpenP;
  const vm     =rows.filter(m=>m._med!=null);
  const tMed   =vm.length?Math.round(vm.reduce((s,m)=>s+m._med,0)/vm.length):null;
  const rl     =REASON_FILTERS.find(r=>r.key===reason)?.label||"All";
  const sfx    =reason!=="all"?` · ${rl}`:"";

  const TOOLTIP_RAW = "Raw: total calendar days from case open to close.\nIncludes all time regardless of status.";
  const TOOLTIP_ADJ = "Adjusted median excludes days where the case was paused outside the analyst's control:\n\n• On Hold — case paused, waiting on customer action or external dependency\n• FourKites Working — internal FK team has taken over (integration, config work)\n• Awaiting Loads — carrier onboarded but waiting for live shipment data to verify\n\nExcluding these gives a fairer measure of how efficiently an analyst moves cases. ~84% of closed cases hit at least one of these statuses, averaging 38 excluded days when they do. Precision: ~±5d.";

  return(
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",padding:"20px 24px",background:"#fff",minHeight:"100vh"}}>

      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{fontSize:18,fontWeight:700,color:"#1a1a1a"}}>🌐 Network Growth team</div>
          <div style={{fontSize:12,color:"#888",marginTop:3}}>{AS_OF} · Week = Mon–Sun</div>
        </div>
        <button onClick={()=>alert("To refresh: open the Claude conversation and say \"Refresh NG Dashboard\".")}
          style={{fontSize:13,padding:"7px 14px",border:"1px solid #ddd",borderRadius:8,background:"#fff",cursor:"pointer",color:"#333",whiteSpace:"nowrap"}}>
          ⟳ How to refresh ↗
        </button>
      </div>

      {/* Filters row */}
      <div style={{display:"flex",gap:16,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <span style={{fontSize:11,color:"#888",marginRight:2}}>REGION</span>
          {REGIONS.map(r=>pill(r,region===r,()=>setRegion(r)))}
        </div>
        <div style={{width:1,height:20,background:"#eee"}}/>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <span style={{fontSize:11,color:"#888",marginRight:2}}>CASE TYPE</span>
          {REASON_FILTERS.map(r=>pill(r.label,reason===r.key,()=>setReason(r.key)))}
        </div>
        <div style={{width:1,height:20,background:"#eee"}}/>
        {/* Median toggle with tooltip */}
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <span style={{fontSize:11,color:"#888",marginRight:2}}>MEDIAN</span>
          <Tooltip text={TOOLTIP_RAW}>
            {pill("Raw", !adjMode, ()=>setAdjMode(false))}
          </Tooltip>
          <Tooltip text={TOOLTIP_ADJ}>
            {pill("Adjusted", adjMode, ()=>setAdjMode(true))}
          </Tooltip>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
        {card(`Open${sfx}`,tOpen)}
        {card(`Backlog WoW${sfx}`,bkWow>=0?`+${bkWow}`:bkWow,bkWow>0?"#b91c1c":bkWow<0?"#15803d":"#888",`vs ${tOpenP} last week`)}
        {card(`Aged >100d${sfx}`,tA100)}
        {card(`New cases${sfx}`,tN7,null,`${THIS_WEEK} · vs ${tNp7} (${PREV_WEEK})`)}
        {card(`Closed${sfx}`,tCl7,cWow>=0?"#15803d":"#b91c1c",`${THIS_WEEK} · vs ${tCp7} (${PREV_WEEK})`)}
        <div style={{background:"#f4f4f3",borderRadius:10,padding:"12px 16px",flex:1,minWidth:110}}>
          <div style={{fontSize:11,color:"#888",marginBottom:4,display:"flex",alignItems:"center",gap:4}}>
            Median close{sfx}
            <Tooltip text={adjMode?TOOLTIP_ADJ:TOOLTIP_RAW}>
              <span style={{width:14,height:14,borderRadius:"50%",background:"#ddd",color:"#666",fontSize:9,display:"inline-flex",alignItems:"center",justifyContent:"center",cursor:"help",fontWeight:700}}>?</span>
            </Tooltip>
          </div>
          <div style={{fontSize:22,fontWeight:700,color:tMed?tMed<70?"#15803d":tMed<100?"#92400e":"#b91c1c":"#aaa"}}>
            {tMed?`${tMed}d`:"—"}
          </div>
          <div style={{fontSize:11,color:"#aaa",marginTop:2}}>{adjMode?"adjusted · excl. holds":"raw · all calendar days"}</div>
        </div>
      </div>

      {/* Table */}
      <div style={{overflowX:"auto",border:"1px solid #eee",borderRadius:10}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead>
            <tr style={{background:"#fafafa"}}>
              {COLS.map(col=>(
                <th key={col.key} onClick={()=>hs(col.key)} style={{fontSize:11,fontWeight:600,color:sortKey===col.key?"#1a1a1a":"#888",textAlign:col.align,padding:"10px 14px",borderBottom:"1px solid #eee",whiteSpace:"nowrap",cursor:"pointer",userSelect:"none"}}>
                  {col.key==="median"?(
                    <Tooltip text={adjMode?TOOLTIP_ADJ:TOOLTIP_RAW}>
                      <span>{adjMode?"Median (adj)":"Median (raw)"} {sortKey===col.key?(sortAsc?"↑":"↓"):"↕"}</span>
                    </Tooltip>
                  ):(
                    <>
                      {col.key==="cl7"?`Closed (${THIS_WEEK})`:col.key==="cp7"?`Prior (${PREV_WEEK})`:col.key==="n7"?`New (${THIS_WEEK})`:col.key==="np7"?`New prior (${PREV_WEEK})`:col.label}{" "}
                      {sortKey===col.key?(sortAsc?"↑":"↓"):"↕"}
                    </>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((m,i)=>(
              <tr key={m.name} style={{borderBottom:i<sorted.length-1?"1px solid #f0f0f0":"none"}}>
                <td style={{padding:"10px 14px",fontWeight:500,textAlign:"left",whiteSpace:"nowrap"}}>{m.name}</td>
                <td style={{padding:"10px 14px",textAlign:"left",color:"#888",fontSize:12}}>{m.region}</td>
                <td style={{padding:"10px 14px",textAlign:"right"}}>{m._open}</td>
                <td style={{padding:"10px 14px",textAlign:"right"}}>{m._a30}</td>
                <td style={{padding:"10px 14px",textAlign:"right"}}><Badge100 v={m._a100} open={m._open}/></td>
                <td style={{padding:"10px 14px",textAlign:"right"}}><BacklogWoW curr={m._open} prev={m._openp7}/></td>
                <td style={{padding:"10px 14px",textAlign:"right"}}>{m._cl7}</td>
                <td style={{padding:"10px 14px",textAlign:"right",color:"#666"}}>{m._cp7}</td>
                <td style={{padding:"10px 14px",textAlign:"right"}}><CloseWoW v={m._cl7-m._cp7}/></td>
                <td style={{padding:"10px 14px",textAlign:"right"}}>{m._n7}</td>
                <td style={{padding:"10px 14px",textAlign:"right",color:"#666"}}>{m._np7}</td>
                <td style={{padding:"10px 14px",textAlign:"right"}}><NewWoW v={m._n7-m._np7}/></td>
                <td style={{padding:"10px 14px",textAlign:"right"}}><Median v={m._med} note={m._medN} adjusted={adjMode}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{fontSize:11,color:"#aaa",marginTop:10}}>
        Week = Mon–Sun · This week: {THIS_WEEK} · Prior: {PREV_WEEK} · Adjusted median excludes On Hold / FourKites Working / Awaiting Loads · * = &lt;10 closed cases · Hover "Raw"/"Adjusted" pills or column header for explanation
      </div>
    </div>
  );
}
