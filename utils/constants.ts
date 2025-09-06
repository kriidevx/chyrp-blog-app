// utils/constants.ts - App constants
export const APP_CONFIG = {
  MAX_COMMENT_LENGTH: 1000,
  MAX_TITLE_LENGTH: 200,
  MAX_EXCERPT_LENGTH: 300,
  POSTS_PER_PAGE: 10,
  RELATED_POSTS_LIMIT: 3,
} as const;

export const REACTION_TYPES = [
  { id: "fire", emoji: "🔥", label: "Fire" },
  { id: "star", emoji: "⭐", label: "Amazing" },
  { id: "coffee", emoji: "☕", label: "Helpful" },
  { id: "bulb", emoji: "💡", label: "Insightful" },
  { id: "target", emoji: "🎯", label: "On Point" },
] as const;