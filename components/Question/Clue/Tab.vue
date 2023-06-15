<template>
  <div
    class="tab-lifted tab flex-1"
    :class="{ 'tab-active': active }"
    @click="emits('click')"
  >
    <div class="indicator">
      <span
        v-if="!viewed"
        class="badge badge-error indicator-item text-xs text-white"
        >-1</span
      >
      {{ value }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ viewed: boolean; active: boolean; value: string }>();
const emits = defineEmits(["click"]);
</script>
