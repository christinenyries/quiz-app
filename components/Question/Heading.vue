<template>
  <h2 class="text-center text-2xl">
    Question {{ questionNo }}/{{ questionCount }}
  </h2>
</template>

<script setup lang="ts">
defineProps<{ questionNo: number; questionCount: number }>();
</script>
