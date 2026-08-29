window.SIS_LEVELS = [
  {
    id: "extra-shadow", title: "Extra Shadow", mechanic: "extra_shadow",
    intro: "SPOT THE IMPOSSIBLE. TAP IT.", question: "TAP THE EXTRA SHADOW.",
    anomalyMs: 1650, hotspot: { x: 34, y: 58, w: 34, h: 30 }, focusId: "thirdShadow",
    revealText: "TWO PEOPLE. THREE SHADOWS.",
    telemetry: { family: "creepy_multiplicity", variant: "third_shadow" }
  },
  {
    id: "wrong-light-switch", title: "Wrong Light Switch", mechanic: "wrong_light_switch",
    intro: "WATCH THE WALL SWITCH.", question: "TAP THE LAMP THE SWITCH TURNED ON.",
    anomalyMs: 1500, hotspot: { x: 60, y: 19, w: 34, h: 36 }, focusId: "rightLamp",
    revealText: "THE WALL SWITCH TURNED ON THE WRONG LAMP.",
    telemetry: { family: "causality", variant: "switch_wrong_target" }
  },
  {
    id: "shadow-ahead", title: "Shadow Ahead", mechanic: "shadow_desync",
    intro: "WATCH THE PERSON AND THE SHADOW.", question: "TAP THE SHADOW THAT MOVED TOO EARLY.",
    anomalyMs: 2050, hotspot: { x: 55, y: 46, w: 39, h: 38 }, focusId: "shadow",
    revealText: "THE SHADOW TURNED BEFORE THE PERSON.",
    telemetry: { family: "creepy_prediction", variant: "corner_leads_person" }
  },
  {
    id: "reverse-splash", title: "Early Splash", mechanic: "reverse_splash",
    intro: "WATCH THE BALL FALL TOWARD THE WATER.", question: "TAP THE SPLASH THAT HAPPENED TOO EARLY.",
    anomalyMs: 1900, hotspot: { x: 27, y: 54, w: 46, h: 29 }, focusId: "splash",
    revealText: "THE WATER SPLASHED BEFORE THE BALL HIT IT.",
    telemetry: { family: "temporal_physics", variant: "visible_effect_before_contact" }
  },
  {
    id: "color-theft", title: "Color Theft", mechanic: "color_theft",
    intro: "FOLLOW THE RED BALL.", question: "TAP WHAT STOLE THE BALL'S COLOR.",
    anomalyMs: 1750, hotspot: { x: 34, y: 34, w: 34, h: 43 }, focusId: "vase",
    revealText: "THE VASE TOOK THE BALL'S RED COLOR.",
    telemetry: { family: "transformation", variant: "color_transfer" }
  }
];
