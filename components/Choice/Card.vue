<template>
  <button
    class="flex cursor-pointer overflow-clip rounded-lg bg-base-100 shadow-md hover:bg-slate-50 disabled:cursor-default disabled:bg-slate-50"
    :class="[
      bordered ? 'border-2' : 'border-hidden',
      choice.isCorrect ? 'border-success' : 'border-error',
    ]"
    :disabled="disabled"
  >
    <NuxtImg
      :src="choice.image"
      placeholder="/dummy.jpg"
      width="140"
      height="200"
      :alt="choice.text"
      fit="cover"
    />
    <p class="flex flex-1 items-center justify-center text-xl font-bold">
      {{ choice.text }}
    </p>
  </button>
</template>

<script setup lang="ts">
import { Choice } from "@/types";
const props = defineProps<{ choice: Choice; bordered: boolean }>();
const disabled = computed(() => props.bordered);
</script>
