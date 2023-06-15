<template>
  <div class="flex h-full flex-col items-stretch justify-between gap-4">
    <div class="flex flex-1 flex-col items-center justify-center gap-2">
      <h3 class="justify-center text-xl font-bold">{{ heading }}</h3>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <p class="text-lg" v-html="message"></p>
    </div>
    <QuestionResultButton
      v-if="!isLastQuestion"
      @click="emits('next-question')"
    >
      Next Question
    </QuestionResultButton>
    <QuestionResultButton v-else @click="emits('check-score')"
      >Check Your Score</QuestionResultButton
    >
  </div>
</template>

<script setup lang="ts">
import { QuizStatus } from "@/types";

const emits = defineEmits(["next-question", "check-score"]);
const props = defineProps<{
  isLastQuestion: boolean;
  correctAnswer: string;
  status: QuizStatus;
}>();
const randomIndex = useRandom(0, 2);
const heading = computed(() =>
  props.status !== "pendingAnswer"
    ? messages[props.status][randomIndex].main
    : ""
);
const message = computed(() =>
  props.status !== "pendingAnswer"
    ? messages[props.status][randomIndex].sub.replace(
        "%s",
        `<span class="font-bold">${props.correctAnswer}</span>`
      )
    : ""
);

const messages: Record<
  Exclude<QuizStatus, "pendingAnswer">,
  { main: string; sub: string }[]
> = {
  correctAnswer: [
    {
      main: "That's correct!",
      sub: "You've cracked the code! The anime that the clues are hinting is %s. Awesome job!",
    },
    {
      main: "Bingo! You're on fire!",
      sub: "The anime you've unveiled through the clues is %s. Well done!",
    },
    {
      main: "You're absolutely right!",
      sub: "You've mastered the clues and revealed the anime as %s. Great work!",
    },
  ],
  wrongAnswer: [
    {
      main: "Oops!",
      sub: "That wasn't the right answer. The correct answer is %s.",
    },
    {
      main: "Oopsie!",
      sub: "That answer didn't match the clues. The correct answer is %s",
    },
    {
      main: "Oh no!",
      sub: "That wasn't quite it. The correct answer is %s.",
    },
  ],
  noAnswer: [
    {
      main: "Time's up!",
      sub: "You were so close! Don't be disheartened, though. Try again and beat the clock next time!",
    },
    {
      main: "Oh no!",
      sub: "The sands of time slipped away. But don't fret! Take a deep breath, gather your thoughts, and give it another shot!",
    },
    {
      main: "Tick-tock!",
      sub: "Time's up, but the game's not over. You've got this! Take a moment to regroup and try again!",
    },
  ],
};
</script>

<style scoped></style>
