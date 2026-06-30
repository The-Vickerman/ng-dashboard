import { useState } from "react";
import NGTeam from "./NGTeam.jsx";
import NAProjects from "./NAProjects.jsx";

export default function App() {
  const [tab, setTab] = useState("ng");

  const tabBtn = (active) => ({
    padding: "8px 18px",
    borderRadius: 6,
    border: "1px solid #30363d",
    background: active ? "#1f6feb" : "#161b22",
    color: active ? "#fff" : "#c9d1d9",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: active ? 600 : 400,
  });

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: "#0d1117", minHeight: "100vh", color: "#e6edf3", padding: "20px" }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
        <button style={tabBtn(tab === "ng")} onClick={() => setTab("ng")}>🚀 NG Team</button>
        <button style={tabBtn(tab === "na")} onClick={() => setTab("na")}>📦 NA Projects</button>
      </div>
      {tab === "ng" ? <NGTeam /> : <NAProjects />}
    </div>
  );
}
