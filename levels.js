window.SIS_LEVELS = [
  {
    id: "shadow-ahead", title: "Shadow Ahead", mechanic: "shadow_desync",
    intro: "WATCH THE PERSON AND THE SHADOW.", question: "TAP THE PART THAT MOVED TOO EARLY.",
    observeMs: 3300, answerMs: 0,
    hotspot: { x: 55, y: 46, w: 39, h: 38 }, focusId: "shadow",
    revealText: "THE SHADOW TURNED BEFORE THE PERSON.",
    telemetry: { family: "creepy_prediction", variant: "corner_leads_person" }
  },
  {
    id: "extra-shadow", title: "Extra Shadow", mechanic: "extra_shadow",
    intro: "COUNT THE PEOPLE. THEN COUNT THE SHADOWS.", question: "TAP THE EXTRA SHADOW.",
    observeMs: 2800, answerMs: 14000,
    hotspot: { x: 34, y: 58, w: 34, h: 30 }, focusId: "thirdShadow",
    revealText: "TWO PEOPLE. THREE SHADOWS.",
    telemetry: { family: "creepy_multiplicity", variant: "third_shadow" }
  },
  {
    id: "wrong-light-switch", title: "Wrong Light Switch", mechanic: "wrong_light_switch",
    intro: "WATCH THE SWITCH AND BOTH LAMPS.", question: "TAP THE LAMP THAT SHOULD NOT BE ON.",
    observeMs: 2700, answerMs: 14000,
    hotspot: { x: 60, y: 19, w: 34, h: 36 }, focusId: "rightLamp",
    revealText: "THE SWITCH TURNED ON THE WRONG LAMP.",
    telemetry: { family: "causality", variant: "switch_wrong_target" }
  },
  {
    id: "reverse-splash", title: "Early Splash", mechanic: "reverse_splash",
    intro: "WATCH THE BALL FALL TOWARD THE WATER.", question: "TAP THE SPLASH WHILE THE BALL IS STILL ABOVE IT.",
    observeMs: 2500, answerMs: 14000,
    hotspot: { x: 27, y: 54, w: 46, h: 29 }, focusId: "splash",
    revealText: "THE WATER SPLASHED BEFORE THE BALL HIT IT.",
    telemetry: { family: "temporal_physics", variant: "visible_effect_before_contact" }
  },
  {
    id: "color-theft", title: "Color Theft", mechanic: "color_theft",
    intro: "FOLLOW THE RED BALL BEHIND THE VASE.", question: "TAP WHAT STOLE THE BALL'S COLOR.",
    observeMs: 3100, answerMs: 12000,
    hotspot: { x: 34, y: 34, w: 34, h: 43 }, focusId: "vase",
    revealText: "THE VASE TOOK THE BALL'S RED COLOR.",
    telemetry: { family: "transformation", variant: "color_transfer" }
  },
  {
    id: "door-two-rooms", title: "Door Two Rooms", mechanic: "door_two_rooms",
    intro: "WATCH THE SAME DOOR OPEN TWICE.", question: "TAP THE DOOR THAT CHANGED WHERE IT LEADS.",
    observeMs: 3900, answerMs: 14000,
    hotspot: { x: 25, y: 15, w: 50, h: 63 }, focusId: "coldRoom",
    revealText: "THE SAME DOOR OPENED TO TWO DIFFERENT PLACES.",
    telemetry: { family: "spatial_logic", variant: "door_incompatible_rooms" }
  },
  {
    id: "wrong-mirror", title: "Wrong Mirror", mechanic: "mirror_desync",
    intro: "WATCH WHERE THE PERSON AND REFLECTION LOOK.", question: "TAP THE REFLECTION LOOKING THE WRONG WAY.",
    observeMs: 2500, answerMs: 14000,
    hotspot: { x: 54, y: 20, w: 36, h: 40 }, focusId: "mirrorFace",
    revealText: "THE REFLECTION LOOKED THE OPPOSITE WAY.",
    telemetry: { family: "reflection_logic", variant: "opposite_gaze" }
  },
  {
    id: "haircut-mirror", title: "Haircut Mirror", mechanic: "haircut_mirror",
    intro: "WATCH THE PERSON AND THE MIRROR.", question: "TAP THE HAIR THAT CHANGED IMPOSSIBLY.",
    observeMs: 3100, answerMs: 14000,
    hotspot: { x: 57, y: 20, w: 35, h: 34 }, focusId: "mirrorHair",
    revealText: "ONLY THE REFLECTION GOT A HAIRCUT.",
    telemetry: { family: "reflection_causality", variant: "mirror_only_haircut" }
  },
  {
    id: "wrong-occlusion", title: "Wrong Occlusion", mechanic: "wrong_occlusion",
    intro: "WATCH THE CAT PASS BEHIND THE CHAIR.", question: "TAP THE PART THAT APPEARED IN FRONT.",
    observeMs: 3400, answerMs: 14000,
    hotspot: { x: 36, y: 47, w: 43, h: 34 }, focusId: "tail",
    revealText: "THE TAIL PASSED IN FRONT OF THE CHAIR.",
    telemetry: { family: "occlusion", variant: "tail_wrong_depth" }
  },
  {
    id: "domino-break", title: "Domino Break", mechanic: "domino_prediction",
    intro: "WATCH THE DOMINOES FALL FROM LEFT TO RIGHT.", question: "TAP THE FIRST DOMINO THAT REFUSED TO FALL.",
    observeMs: 3900, answerMs: 14000,
    hotspot: { x: 47, y: 52, w: 22, h: 29 }, focusId: "d5",
    revealText: "THE CHAIN STOPPED AT THIS DOMINO.",
    telemetry: { family: "prediction", variant: "impossible_chain_break" }
  }
];
