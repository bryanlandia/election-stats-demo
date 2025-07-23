// Color constants for different contest types

/** Colors for non-partisan contests (shades of gray) */
export const NON_PARTISAN_COLORS = [
  '#666666',
  '#808080',
  '#999999',
  '#b3b3b3',
  '#cccccc',
] as const;

/** Colors for ballot questions (Yes/No votes) */
export const BALLOT_QUESTION_COLORS = {
  YES: '#6b9b6b',
  NO: '#c66b6b',
} as const;
