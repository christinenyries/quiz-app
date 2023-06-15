<template>
  <div class="flex h-full flex-col gap-4">
    <div class="flex items-center gap-2">
      <label for="clues">Clues</label>
      <div id="clues" class="tab flex-1">
        <QuestionClueTab
          v-for="(tab, key, index) in clueTabs"
          :key="key"
          :value="(index + 1).toString()"
          :active="tab.active"
          :viewed="tab.viewed"
          @click="handleTabClick(key)"
        />
      </div>
    </div>
    <div class="flex flex-1 flex-col overflow-auto">
      <p class="italic">{{ clueTabs[activeClueTabKey].description }}</p>
      <p class="flex flex-1 items-center justify-center">
        <span class="p-4 font-bold">
          {{ activeClueTab.clue }}
        </span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Clue, Question } from "@/types";
const props = defineProps<{ clues: Question["clues"] }>();
const emits = defineEmits(["clue-opened"]);

const clueTabs = reactive<
  Record<
    Clue,
    { active: boolean; viewed: boolean; description: string; clue: string }
  >
>({
  character: {
    description: "On which anime did this character appeared?",
    active: true,
    viewed: true,
    clue: props.clues.character,
  },
  quote: {
    description: "On which anime were these lines said?",
    active: false,
    viewed: false,
    clue: props.clues.quote,
  },
  genres: {
    description: "This anime have the following genre(s):",
    active: false,
    viewed: false,
    clue: props.clues.genres,
  },
  synopsis: {
    description: "This anime played out as follows:",
    active: false,
    viewed: false,
    clue: props.clues.synopsis,
  },
  startDate: {
    description: "This anime aired on:",
    active: false,
    viewed: false,
    clue: props.clues.startDate,
  },
});

const activeClueTabKey = ref<Clue>("character");
const activeClueTab = computed(() => clueTabs[activeClueTabKey.value]);
const handleTabClick = (tab: Clue) => {
  // Tab/clue is opened/viewed for the first time
  if (!clueTabs[tab].viewed) {
    clueTabs[tab].viewed = true;
    emits("clue-opened");
  }

  clueTabs[activeClueTabKey.value].active = false;
  clueTabs[tab].active = true;

  activeClueTabKey.value = tab;
};
</script>
