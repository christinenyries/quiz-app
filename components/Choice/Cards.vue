<template>
  <div class="flex flex-col gap-4">
    <ChoiceCard
      v-for="choice in choices"
      :key="choice.id"
      :choice="choice"
      :bordered="bordered"
      @click="emits('choice-selected', choice)"
    />
  </div>
</template>

<script setup lang="ts">
import { Choice } from "@/types";

defineProps<{ choices: Choice[]; bordered: boolean }>();
const emits = defineEmits(["choice-selected"]);
</script>
