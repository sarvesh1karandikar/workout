// Every exercise lists the muscle groups it primarily targets.
// Those IDs match the <path data-muscle="..."> regions in the SVG silhouettes.
// Muscle palette:
//   chest, delts-front, delts-rear, delts-side,
//   triceps, biceps, forearms,
//   back-upper, back-lats, back-lower,
//   abs, obliques,
//   glutes, quads, hams, calves

export const WORKOUTS = {
  push: {
    title: "Push",
    accent: "#ef4444",
    view: "front",
    muscles: ["chest", "delts-front", "delts-side", "triceps"],
    exercises: [
      { name: "Flat DB Press",             sets: 3, reps: "10", primary: ["chest", "triceps"],                      view: "front" },
      { name: "Incline DB Press",          sets: 3, reps: "10", primary: ["chest", "delts-front"],                  view: "front" },
      { name: "Decline DB Press",          sets: 3, reps: "10", primary: ["chest"],                                 view: "front" },
      { name: "DB Shoulder Press",         sets: 3, reps: "12", primary: ["delts-front", "delts-side", "triceps"],  view: "front" },
      { name: "Lateral Raise",             sets: 3, reps: "15", primary: ["delts-side"],                            view: "front" },
      { name: "Overhead Tricep Extension", sets: 3, reps: "12", primary: ["triceps"],                               view: "back"  },
    ],
  },
  pull: {
    title: "Pull",
    accent: "#3b82f6",
    view: "back",
    muscles: ["back-upper", "back-lats", "back-lower", "delts-rear", "biceps", "hams"],
    exercises: [
      { name: "RDL",               sets: 3, reps: "10", primary: ["hams", "glutes", "back-lower"], view: "back"  },
      { name: "Single Arm DB Row", sets: 3, reps: "10", primary: ["back-lats", "biceps"],          view: "back"  },
      { name: "Incline DB Row",    sets: 3, reps: "10", primary: ["back-upper", "back-lats"],      view: "back"  },
      { name: "Rear Delt Fly",     sets: 3, reps: "15", primary: ["delts-rear", "back-upper"],     view: "back"  },
      { name: "Hammer Curl",       sets: 3, reps: "12", primary: ["biceps", "forearms"],           view: "front" },
      { name: "Incline DB Curl",   sets: 3, reps: "12", primary: ["biceps"],                       view: "front" },
    ],
  },
  legs: {
    title: "Legs + Core",
    accent: "#10b981",
    view: "front",
    muscles: ["quads", "glutes", "hams", "calves", "abs", "obliques"],
    exercises: [
      { name: "Goblet Squat",     sets: 3, reps: "12",          primary: ["quads", "glutes"],        view: "front" },
      { name: "Sumo Squat",       sets: 3, reps: "12",          primary: ["quads", "glutes", "hams"], view: "front" },
      { name: "Walking Lunge",    sets: 3, reps: "10 each leg", primary: ["quads", "glutes"],        view: "front" },
      { name: "Hip Thrust",       sets: 3, reps: "15",          primary: ["glutes", "hams"],         view: "back"  },
      { name: "Calf Raises",      sets: 3, reps: "20",          primary: ["calves"],                 view: "back"  },
      { name: "Ab Wheel Rollout", sets: 3, reps: "8",           primary: ["abs", "obliques"],        view: "front" },
      { name: "Russian Twist",    sets: 3, reps: "20",          primary: ["obliques", "abs"],        view: "front" },
      { name: "Plank",            sets: 3, reps: "30 sec",      primary: ["abs", "obliques"],        view: "front" },
    ],
  },
};

export const WORKOUT_ORDER = ["push", "pull", "legs"];
