export type Clue = "character" | "synopsis" | "quote" | "genres" | "startDate";

export interface Choice {
  id: string;
  image: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  clues: Record<Clue, string>;
  choices: Choice[];
}

export type QuizStatus =
  | "pendingAnswer"
  | "noAnswer"
  | "correctAnswer"
  | "wrongAnswer";
