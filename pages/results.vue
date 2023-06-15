<template>
  <div class="flex flex-col items-center gap-4">
    <h1 class="text-3xl">Your final score is</h1>
    <p class="my-6 flex items-end gap-2">
      <span class="text-9xl font-medium text-neutral">{{
        questionsStore.score
      }}</span>
      <span class="text-2xl">/</span>
      <span class="text-2xl">{{ questionsStore.maxScore }}</span>
    </p>
    <div class="stats shadow">
      <div
        v-for="statistic in statistics"
        :key="statistic.label"
        class="stat place-items-center"
      >
        <div class="stat-title">{{ statistic.label }}</div>
        <div class="stat-value" :class="statistic.color">
          {{ statistic.value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const questionsStore = useQuestionsStore();
const statistics = [
  {
    label: "Correct Answers",
    value: `+${questionsStore.correctAnswerCount} x ${questionsStore.pointsPerCorrectAnswer}`,
    color: "text-success",
  },
  {
    label: "Clues Opened",
    value: `-${questionsStore.cluesOpenedCount}`,
    color: "text-error",
  },
];
</script>

<style scoped></style>
