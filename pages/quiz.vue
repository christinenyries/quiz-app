<template>
  <div
    v-if="questionsStore.status === 'loaded'"
    class="my-12 flex flex-col gap-4 rounded-xl p-6 shadow-xl"
  >
    <QuestionHeading
      :question-count="questionsStore.count"
      :question-no="questionsStore.questionNo"
    />
    <QuestionTimer
      :key="questionsStore.questionNo"
      :seconds="60"
      :paused="isTimerPaused"
      @expired="handleTimeExpired"
    />
    <div class="h-[200px] text-center">
      <QuestionClues
        v-if="status === 'pendingAnswer' && questionsStore.clues"
        :clues="questionsStore.clues"
        @clue-opened="handleClueOpened"
      />
      <QuestionResult
        v-else
        :is-last-question="questionsStore.isLastQuestion"
        :correct-answer="questionsStore.answer?.text || ''"
        :status="status"
        @next-question="handleNextQuestion"
        @check-score="handleCheckScore"
      />
    </div>
    <ChoiceCards
      :choices="questionsStore.choices ?? []"
      :bordered="showAnswer"
      @choice-selected="handleChoiceSelected"
    />
  </div>
  <div v-else class="flex w-full flex-col items-center gap-2">
    <progress class="progress-info progress"></progress>
    <p>{{ questionsStore.statusMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { Choice, QuizStatus } from "@/types";

const status = ref<QuizStatus>("pendingAnswer");
const questionsStore = useQuestionsStore();

const showAnswer = computed(() => status.value !== "pendingAnswer");
const isTimerPaused = computed(
  () => status.value === "wrongAnswer" || status.value === "correctAnswer"
);

const handleChoiceSelected = (choice: Choice) => {
  if (choice.isCorrect) {
    status.value = "correctAnswer";
    questionsStore.correctAnswerCount++;
  } else {
    status.value = "wrongAnswer";
  }
};

const handleTimeExpired = () => {
  status.value = "noAnswer";
};

const handleClueOpened = () => {
  questionsStore.cluesOpenedCount++;
};

const handleNextQuestion = () => {
  status.value = "pendingAnswer";
  questionsStore.goToNextQuestion();
};

const handleCheckScore = () => {
  navigateTo("/results");
};
onMounted(async () => {
  questionsStore.$reset();
  await questionsStore.load();
});
</script>
