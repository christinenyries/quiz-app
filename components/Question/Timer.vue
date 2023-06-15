<template>
  <div class="flex w-full items-center gap-2">
    <Icon name="bi:alarm" class="text-xl" />
    <progress
      class="progress"
      :class="progressColor"
      :value="remaining"
      :max="seconds"
    ></progress>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  seconds: number;
  paused: boolean;
}>();
const remaining = ref(props.seconds);
const emits = defineEmits(["expired"]);
const timer = setInterval(() => {
  if (remaining.value === 0) {
    clearInterval(timer);
    emits("expired");
  }
  if (props.paused) {
    clearInterval(timer);
  }
  remaining.value--;
}, 1000);

const progressColor = computed(() => {
  const percentageRemaining = remaining.value / props.seconds;
  return {
    "progress-info": percentageRemaining > 0.5,
    "progress-warning":
      percentageRemaining > 0.25 && percentageRemaining <= 0.5,
    "progress-error": percentageRemaining > 0 && percentageRemaining <= 0.25,
  };
});

onBeforeUnmount(() => {
  clearInterval(timer);
});
</script>
