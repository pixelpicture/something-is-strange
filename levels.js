window.SIS_LEVELS = [
  {
    id: "shadow-ahead",
    title: "Shadow Ahead",
    mechanic: "shadow_desync",
    hook: "YOU HAVE 5 SECONDS. WHAT'S WRONG?",
    durationMs: 5000,
    hotspot: { x: 55, y: 50, w: 36, h: 34 },
    focusId: "shadow",
    revealText: "THE SHADOW TURNED FIRST.",
    telemetry: { family: "creepy_prediction", variant: "corner_leads_person" }
  },
  {
    id: "late-mirror",
    title: "Late Mirror",
    mechanic: "mirror_desync",
    hook: "YOU HAVE 5 SECONDS. WHAT'S WRONG?",
    durationMs: 5000,
    hotspot: { x: 54, y: 20, w: 36, h: 40 },
    focusId: "mirrorFace",
    revealText: "THE REFLECTION WAS LATE.",
    telemetry: { family: "temporal_anomaly", variant: "reflection_lag" }
  },
  {
    id: "domino-break",
    title: "Domino Break",
    mechanic: "domino_prediction",
    hook: "WHERE DOES IT FAIL?",
    durationMs: 5000,
    hotspot: { x: 47, y: 53, w: 22, h: 27 },
    focusId: "d5",
    revealText: "THE CHAIN STOPS HERE.",
    telemetry: { family: "prediction", variant: "impossible_chain_break" }
  },
  {
    id: "wrong-light-switch",
    title: "Wrong Light Switch",
    mechanic: "wrong_light_switch",
    hook: "WHAT DID THE SWITCH DO WRONG?",
    durationMs: 5000,
    hotspot: { x: 61, y: 24, w: 32, h: 30 },
    focusId: "rightLamp",
    revealText: "THE WRONG LAMP TURNED ON.",
    telemetry: { family: "causality", variant: "switch_wrong_target" }
  },
  {
    id: "color-theft",
    title: "Color Theft",
    mechanic: "color_theft",
    hook: "FOLLOW THE RED BALL. WHAT'S WRONG?",
    durationMs: 5000,
    hotspot: { x: 34, y: 35, w: 34, h: 40 },
    focusId: "vase",
    revealText: "THE BALL STOLE THE VASE'S COLOR.",
    telemetry: { family: "transformation", variant: "color_transfer" }
  },
  {
    id: "wrong-occlusion",
    title: "Wrong Occlusion",
    mechanic: "wrong_occlusion",
    hook: "WATCH THE CAT. WHAT'S IMPOSSIBLE?",
    durationMs: 5000,
    hotspot: { x: 38, y: 48, w: 40, h: 32 },
    focusId: "tail",
    revealText: "THE TAIL PASSED IN FRONT OF THE CHAIR.",
    telemetry: { family: "occlusion", variant: "tail_wrong_depth" }
  },
  {
    id: "reverse-splash",
    title: "Reverse Splash",
    mechanic: "reverse_splash",
    hook: "WHAT HAPPENED TOO EARLY?",
    durationMs: 5000,
    hotspot: { x: 29, y: 57, w: 42, h: 24 },
    focusId: "splash",
    revealText: "THE SPLASH HAPPENED BEFORE IMPACT.",
    telemetry: { family: "temporal_physics", variant: "effect_before_cause" }
  },
  {
    id: "door-two-rooms",
    title: "Door Two Rooms",
    mechanic: "door_two_rooms",
    hook: "SAME DOOR. WATCH TWICE.",
    durationMs: 5200,
    hotspot: { x: 25, y: 16, w: 50, h: 62 },
    focusId: "coldRoom",
    revealText: "THE SAME DOOR OPENED TO TWO PLACES.",
    telemetry: { family: "spatial_logic", variant: "door_incompatible_rooms" }
  },
  {
    id: "haircut-mirror",
    title: "Haircut Mirror",
    mechanic: "haircut_mirror",
    hook: "WATCH THE HAIRCUT. WHAT CHANGED?",
    durationMs: 5000,
    hotspot: { x: 57, y: 21, w: 35, h: 31 },
    focusId: "mirrorHair",
    revealText: "ONLY THE REFLECTION LOST HAIR.",
    telemetry: { family: "reflection_causality", variant: "mirror_only_haircut" }
  },
  {
    id: "extra-shadow",
    title: "Extra Shadow",
    mechanic: "extra_shadow",
    hook: "COUNT THE SHADOWS.",
    durationMs: 5000,
    hotspot: { x: 49, y: 50, w: 42, h: 34 },
    focusId: "thirdShadow",
    revealText: "TWO PEOPLE. THREE SHADOWS.",
    telemetry: { family: "creepy_multiplicity", variant: "third_shadow" }
  }
];
