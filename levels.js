window.SIS_LEVELS = [
  {
    id: "shadow-ahead",
    title: "Shadow Ahead",
    mechanic: "shadow_desync",
    hook: "YOU HAVE 5 SECONDS. WHAT'S WRONG?",
    durationMs: 5000,
    hotspot: { x: 55, y: 50, w: 36, h: 34 },
    telemetry: { family: "creepy_prediction", variant: "corner_leads_person" }
  },
  {
    id: "late-mirror",
    title: "Late Mirror",
    mechanic: "mirror_desync",
    hook: "YOU HAVE 5 SECONDS. WHAT'S WRONG?",
    durationMs: 5000,
    hotspot: { x: 47, y: 19, w: 44, h: 45 },
    telemetry: { family: "temporal_anomaly", variant: "reflection_lag" }
  },
  {
    id: "domino-break",
    title: "Domino Break",
    mechanic: "domino_prediction",
    hook: "WHERE DOES IT FAIL?",
    durationMs: 5000,
    hotspot: { x: 47, y: 53, w: 22, h: 27 },
    telemetry: { family: "prediction", variant: "impossible_chain_break" }
  }
];
