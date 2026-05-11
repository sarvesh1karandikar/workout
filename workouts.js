export const WORKOUTS = {
  push: {
    title: "Push",
    exercises: [
      { name: "Flat DB Press",             sets: 3, reps: "10" },
      { name: "Incline DB Press",          sets: 3, reps: "10" },
      { name: "Decline DB Press",          sets: 3, reps: "10" },
      { name: "DB Shoulder Press",         sets: 3, reps: "12" },
      { name: "Lateral Raise",             sets: 3, reps: "15" },
      { name: "Overhead Tricep Extension", sets: 3, reps: "12" },
    ],
  },
  pull: {
    title: "Pull",
    exercises: [
      { name: "RDL",                sets: 3, reps: "10" },
      { name: "Single Arm DB Row",  sets: 3, reps: "10" },
      { name: "Incline DB Row",     sets: 3, reps: "10" },
      { name: "Rear Delt Fly",      sets: 3, reps: "15" },
      { name: "Hammer Curl",        sets: 3, reps: "12" },
      { name: "Incline DB Curl",    sets: 3, reps: "12" },
    ],
  },
  legs: {
    title: "Legs + Core",
    exercises: [
      { name: "Goblet Squat",      sets: 3, reps: "12" },
      { name: "Sumo Squat",        sets: 3, reps: "12" },
      { name: "Walking Lunge",     sets: 3, reps: "10 each leg" },
      { name: "Hip Thrust",        sets: 3, reps: "15" },
      { name: "Calf Raises",       sets: 3, reps: "20" },
      { name: "Ab Wheel Rollout",  sets: 3, reps: "8" },
      { name: "Russian Twist",     sets: 3, reps: "20" },
      { name: "Plank",             sets: 3, reps: "30 sec" },
    ],
  },
};

export const WORKOUT_ORDER = ["push", "pull", "legs"];
