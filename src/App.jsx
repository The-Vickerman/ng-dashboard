import { useState, useMemo } from "react";

// Week definition: fixed Mon-Sun
// This week:  Mon Jun 9 – Sun Jun 15, 2026
// Prior week: Mon Jun 2 – Sun Jun 8, 2026
const AS_OF     = "June 16, 2026 — Live from Salesforce";
const THIS_WEEK = "Jun 9–15";
const PREV_WEEK = "Jun 2–8";

const TEAM = [
  {
    name: "Aline Ventura", region: "Americas",
    open:  { new:34,  addon:78,  update:7,   all:133 },
    a30:   { new:31,  addon:75,  update:5,   all:112 },
    a100:  { new:0,   addon:7,   update:0,   all:7   },
    cl7:   { new:2,   addon:5,   update:1,   all:12  },
    cp7:   { new:6,   addon:1,   update:3,   all:13  },
    new7:  { new:0,   addon:1,   update:0,   all:2   },
    median:{ new:99,  addon:84,  update:42,  all:80  },
    mNote: { new:false,addon:false,update:false,all:false },
  },
  {
    name: "Daisy Marquez", region: "Americas",
    open:  { new:14,  addon:9,   update:22,  all:55  },
    a30:   { new:13,  addon:9,   update:22,  all:52  },
    a100:  { new:10,  addon:5,   update:20,  all:43  },
    cl7:   { new:0,   addon:0,   update:0,   all:0   },
    cp7:   { new:0,   addon:0,   update:0,   all:0   },
    new7:  { new:0,   addon:0,   update:0,   all:0   },
    median:{ new:200, addon:200, update:186, all:196 },
    mNote: { new:false,addon:false,update:true,all:false },
  },
  {
    name: "Jevon Jackson", region: "Americas",
    open:  { new:28,  addon:23,  update:27,  all:81  },
    a30:   { new:21,  addon:12,  update:18,  all:54  },
    a100:  { new:11,  addon:6,   update:3,   all:23  },
    cl7:   { new:0,   addon:1,   update:2,   all:3   },
    cp7:   { new:1,   addon:0,   update:2,   all:4   },
    new7:  { new:0,   addon:0,   update:0,   all:0   },
    median:{ new:58,  addon:50,  update:37,  all:45  },
    mNote: { new:false,addon:false,update:false,all:false },
  },
  {
    name: "Kristen Whitman", region: "Americas",
    open:  { new:4,   addon:8,   update:3,   all:15  },
    a30:   { new:3,   addon:3,   update:2,   all:8   },
    a100:  { new:0,   addon:2,   update:1,   all:3   },
    cl7:   { new:0,   addon:2,   update:0,   all:2   },
    cp7:   { new:0,   addon:0,   update:0,   all:1   },
    new7:  { new:0,   addon:0,   update:0,   all:1   },
    median:{ new:91,  addon:90,  update:39,  all:83  },
    mNote: { new:false,addon:false,update:false,all:false },
  },
  {
    name: "Kristina Quirouette", region: "Americas",
    open:  { new:25,  addon:7,   update:10,  all:60  },
    a30:   { new:23,  addon:7,   update:7,   all:50  },
    a100:  { new:7,   addon:4,   update:2,   all:23  },
    cl7:   { new:0,   addon:0,   update:2,   all:9   },
    cp7:   { new:1,   addon:0,   update:1,   all:24  },
    new7:  { new:1,   addon:0,   update:2,   all:7   },
    median:{ new:132, addon:72,  update:76,  all:88  },
    mNote: { new:false,addon:false,update:false,all:false },
  },
  {
    name: "Mariana Freitas", region: "Americas",
    open:  { new:18,  addon:14,  update:24,  all:63  },
    a30:   { new:14,  addon:7,   update:12,  all:40  },
    a100:  { new:2,   addon:5,   update:1,   all:8   },
    cl7:   { new:1,   addon:2,   update:5,   all:8   },
    cp7:   { new:2,   addon:2,   update:0,   all:5   },
    new7:  { new:0,   addon:2,   update:2,   all:4   },
    median:{ new:79,  addon:59,  update:33,  all:58  },
    mNote: { new:false,addon:false,update:false,all:false },
  },
  {
    name: "Nia Gillenwater", region: "Americas",
    open:  { new:17,  addon:25,  update:25,  all:72  },
    a30:   { new:14,  addon:19,  update:17,  all:53  },
    a100:  { new:4,   addon:3,   update:3,   all:11  },
    cl7:   { new:0,   addon:1,   update:2,   all:5   },
    cp7:   { new:0,   addon:1,   update:7,   all:8   },
    new7:  { new:0,   addon:1,   update:0,   all:5   },
    median:{ new:83,  addon:52,  update:47,  all:57  },
    mNote: { new:false,addon:false,update:false,all:false },
  },
  {
    name: "Fabrizio Ramires", region: "Americas",
    open:  { new:5,   addon:3,   update:7,   all:20  },
    a30:   { new:4,   addon:1,   update:2,   all:7   },
    a100:  { new:0,   addon:1,   update:0,   all:1   },
    cl7:   { new:0,   addon:0,   update:0,   all:0   },
    cp7:   { new:0,   addon:0,   update:1,   all:1   },
    new7:  { new:0,   addon:0,   update:1,   all:1   },
    median:{ new:null,addon:null,update:38,  all:38  },
    mNote: { new:true,addon:true,update:true,all:true },
  },
  {
    name: "Nathalie Lesmes Rodriguez", region: "EU",
    open:  { new:12,  addon:13,  update:6,   all:48  },
    a30:   { new:10,  addon:11,  update:3,   all:38  },
    a100:  { new:5,   addon:9,   update:0,   all:20  },
    cl7:   { new:2,   addon:3,   update:1,   all:7   },
    cp7:   { new:0,   addon:0,   update:1,   all:2   },
    new7:  { new:2,   addon:0,   update:1,   all:4   },
    median:{ new:74,  addon:121, update:55,  all:88  },
    mNote: { new:false,addon:false,update:false,all:false },
  },
  {
    name: "Oleksii Kosenko", region: "EU",
    open:  { new:10,  addon:22,  update:15,  all:57  },
    a30:   { new:8,   addon:2,   update:15,  all:32  },
    a100:  { new:6,   addon:2,   update:8,   all:18  },
    cl7:   { new:0,   addon:0,   update:0,   all:0   },
    cp7:   { new:0,   addon:0,   update:0,   all:1   },
    new7:  { new:0,   addon:0,   update:0,   all:0   },
    median:{ new:176, addon:163, update:129, all:162 },
    mNote: { new:false,addon:false,update:false,all:false },
  },
  {
    name: "Prathiba Seetharaman", region: "EU",
    open:  { new:5,   addon:3,   update:0,   all:23  },
    a30:   { new:5,   addon:3,   update:0,   all:22  },
    a100:  { new:4,   addon:3,   update:0,   all:18  },
    cl7:   { new:0,   addon:0,   update:0,   all:0   },
    cp7:   { new:0,   addon:0,   update:0,   all:0   },
    new7:  { new:0,   addon:0,   update:0,   all:0   },
    median:{ new:null,addon:null,update:null,all:null },
    mNote: { new:true,addon:true,update:true,all:true },
  },
];

const REASON_FILTERS = [
  { key:"all",   label:"All"    },
  { key:"new",   label:"New"    },
  { key:"addon", label:"Add-on" },
  { key:"update",label:"Update" },
];
const REGIONS = ["All","Americas","EU"];
const COLS = [
  { key:"name",   label:"Analyst",      align:"left"  },
  { key:"region", label:"Region",       align:"left"  },
  { key:"open",   label:"Open",         align:"right" },
  { key:"a30",    label:">30d",         align:"right" },
  { key:"a100",   label:">100d",        align:"right" },
  { key:"cl7",    label:"Closed",       align:"right" },
  { key:"cp7",    label:"Prior wk",     align:"right" },
  { key:"cWow",   label:"WoW ↑",        align:"right" },
  { key:"new7",   label:"New cases",    align:"right" },
  { key:"median", label:"Median close", align:"right" },
];

const g = (o,k) => o?.[k] ?? 0;

function Badge100({v,open}){
  if(!open) return <span style={{color:"#aaa"}}>—</span>;
  const pct=v/open;
  const [bg,fg]=pct>0.4?["#fee2e2","#b91c1c"]:pct>0.2?["#fef3c7","#92400e"]:["#dcfce7","#15803d"];
  return <span style={{background:bg,color:fg,fontSize:11,padding:"2px 8px",borderRadius:6,fontWeight:600}}>{v}</span>;
}
function WoW({v}){
  if(!v) return <span style={{color:"#aaa"}}>—</span>;
  return <span style={{color:v>0?"#15803d":"#b91c1c",fontWeight:600}}>{v>0?`+${v}`:v}</span>;
}
function Median({v,note}){
  if(v==null) return <span style={{color:"#aaa"}}>—{note&&<span style={{fontSize:10}}> *</span>}</span>;
  const c=v<50?"#15803d":v<100?"#92400e":"#b91c1c";
  return <span style={{color:c,fontWeight:600}}>{v}d{note&&<span style={{color:"#bbb",fontWeight:400,fontSize:10}}> *</span>}</span>;
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
  const [region,setRegion]=useState("All");
  const [reason,setReason]=useState("all");
  const [sortKey,setSortKey]=useState("open");
  const [sortAsc,setSortAsc]=useState(false);

  const filtered=useMemo(()=>TEAM.filter(m=>region==="All"||m.region===region),[region]);

  const rows=useMemo(()=>filtered.map(m=>({
    ...m,
    _open: g(m.open,reason),
    _a30:  g(m.a30, reason),
    _a100: g(m.a100,reason),
    _cl7:  g(m.cl7, reason),
    _cp7:  g(m.cp7, reason),
    _new7: g(m.new7,reason),
    _med:  m.median?.[reason]??null,
    _medN: m.mNote?.[reason]??false,
  })),[filtered,reason]);

  const sorted=useMemo(()=>[...rows].sort((a,b)=>{
    let av,bv;
    const km={open:"_open",a30:"_a30",a100:"_a100",cl7:"_cl7",cp7:"_cp7",new7:"_new7"};
    if(sortKey==="cWow")       {av=a._cl7-a._cp7;  bv=b._cl7-b._cp7;}
    else if(sortKey==="median"){av=a._med??999;    bv=b._med??999;}
    else if(km[sortKey])       {av=a[km[sortKey]]; bv=b[km[sortKey]];}
    else                       {av=a[sortKey];     bv=b[sortKey];}
    if(typeof av==="string") return sortAsc?av.localeCompare(bv):bv.localeCompare(av);
    return sortAsc?av-bv:bv-av;
  }),[rows,sortKey,sortAsc]);

  function hs(k){sortKey===k?setSortAsc(a=>!a):(setSortKey(k),setSortAsc(false));}

  const tOpen =rows.reduce((s,m)=>s+m._open,0);
  const tA100 =rows.reduce((s,m)=>s+m._a100,0);
  const tCl7  =rows.reduce((s,m)=>s+m._cl7,0);
  const tCp7  =rows.reduce((s,m)=>s+m._cp7,0);
  const tNew7 =rows.reduce((s,m)=>s+m._new7,0);
  const cWow  =tCl7-tCp7;
  const vm    =rows.filter(m=>m._med!=null);
  const tMed  =vm.length?Math.round(vm.reduce((s,m)=>s+m._med,0)/vm.length):null;
  const rl    =REASON_FILTERS.find(r=>r.key===reason)?.label||"All";
  const suffix=reason!=="all"?` · ${rl}`:"";

  return(
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",padding:"20px 24px",background:"#fff",minHeight:"100vh"}}>

      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{fontSize:18,fontWeight:700,color:"#1a1a1a"}}>🌐 Network Growth team</div>
          <div style={{fontSize:12,color:"#888",marginTop:3}}>{AS_OF} · Week = Mon–Sun</div>
        </div>
        <button onClick={()=>alert("To refresh: open the Claude conversation and click ⟳ Refresh live data.")}
          style={{fontSize:13,padding:"7px 14px",border:"1px solid #ddd",borderRadius:8,background:"#fff",cursor:"pointer",color:"#333",whiteSpace:"nowrap"}}>
          ⟳ Refresh live data ↗
        </button>
      </div>

      {/* Filters */}
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
      </div>

      {/* Summary cards */}
      <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
        {card(`Open${suffix}`,tOpen)}
        {card(`Aged >100d${suffix}`,tA100)}
        {card(`New cases${suffix}`,tNew7,"#1a1a1a",THIS_WEEK)}
        {card(`Closed${suffix}`,tCl7,cWow>=0?"#15803d":"#b91c1c",`${THIS_WEEK} · vs ${tCp7} (${PREV_WEEK})`)}
        {card(`WoW closed${suffix}`,cWow>=0?`+${cWow}`:cWow,cWow>=0?"#15803d":"#b91c1c","week on week")}
        {card(`Median close${suffix}`,tMed?`${tMed}d`:"—",tMed?tMed<70?"#15803d":tMed<100?"#92400e":"#b91c1c":null,"team median")}
      </div>

      {/* Table */}
      <div style={{overflowX:"auto",border:"1px solid #eee",borderRadius:10}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead>
            <tr style={{background:"#fafafa"}}>
              {COLS.map(col=>(
                <th key={col.key} onClick={()=>hs(col.key)} style={{fontSize:11,fontWeight:600,color:sortKey===col.key?"#1a1a1a":"#888",textAlign:col.align,padding:"10px 14px",borderBottom:"1px solid #eee",whiteSpace:"nowrap",cursor:"pointer",userSelect:"none"}}>
                  {col.key==="cl7"?`Closed${suffix} (${THIS_WEEK})`:col.key==="cp7"?`Prior wk (${PREV_WEEK})`:col.key==="new7"?`New cases${suffix} (${THIS_WEEK})`:col.key==="open"&&reason!=="all"?`Open · ${rl}`:col.label}{" "}
                  {sortKey===col.key?(sortAsc?"↑":"↓"):"↕"}
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
                <td style={{padding:"10px 14px",textAlign:"right"}}>{m._cl7}</td>
                <td style={{padding:"10px 14px",textAlign:"right",color:"#666"}}>{m._cp7}</td>
                <td style={{padding:"10px 14px",textAlign:"right"}}><WoW v={m._cl7-m._cp7}/></td>
                <td style={{padding:"10px 14px",textAlign:"right"}}>{m._new7}</td>
                <td style={{padding:"10px 14px",textAlign:"right"}}><Median v={m._med} note={m._medN}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{fontSize:11,color:"#aaa",marginTop:10}}>
        Week = Mon–Sun fixed · This week: {THIS_WEEK} · Prior week: {PREV_WEEK} · Open/aged = live · * = &lt;10 closed cases, median unreliable · WoW ↑ good
      </div>
    </div>
  );
}
