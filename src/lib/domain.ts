export const TOPICS = [
  "Algebra",
  "Geometry",
  "NumberTheory",
  "Combinatorics",
] as const;

export const MISTAKE_TYPES = [
  "WrongSetup",
  "CalculationError",
  "MisreadProblem",
  "ConceptGap",
  "TimePressure",
] as const;

export const CONFIDENCE_LEVELS = ["Low", "Medium", "High"] as const;
export const REVIEW_RESULTS = ["Correct", "Incorrect"] as const;
export const PROBLEM_STATUSES = ["Active", "Mastered"] as const;

export type Topic = (typeof TOPICS)[number];
export type MistakeType = (typeof MISTAKE_TYPES)[number];
export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[number];
export type ReviewResult = (typeof REVIEW_RESULTS)[number];
export type ProblemStatus = (typeof PROBLEM_STATUSES)[number];

export const TOPIC_LABELS: Record<Topic, string> = {
  Algebra: "Algebra",
  Geometry: "Geometry",
  NumberTheory: "Number Theory",
  Combinatorics: "Combinatorics",
};

export const MISTAKE_TYPE_LABELS: Record<MistakeType, string> = {
  WrongSetup: "Wrong setup",
  CalculationError: "Calculation error",
  MisreadProblem: "Misread problem",
  ConceptGap: "Concept gap",
  TimePressure: "Time pressure",
};

export const CONFIDENCE_LABELS: Record<ConfidenceLevel, string> = {
  Low: "Low confidence",
  Medium: "Medium confidence",
  High: "High confidence",
};

export const STATUS_LABELS: Record<ProblemStatus, string> = {
  Active: "Active review",
  Mastered: "Mastered",
};
