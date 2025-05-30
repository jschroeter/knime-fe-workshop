<script setup lang="ts">
import { onMounted } from "vue";

import { Button, ProgressBar } from "@knime/components";

import { onKeyStroke } from "@vueuse/core";
import { useGameStore } from "~/stores/game";
import { useLetterState } from "~/composables/useLetterState";
import { useReveal } from "~/composables/useReveal";

const props = defineProps<{
  name: string;
}>();

const gameStore = useGameStore();

const name = computed(() => props.name);
const {
  hiddenEntries,
  letterAndState,
  nextHiddenLetter,
  numberOfSolvedLetters,
  isSolved,
  percentage,
  updateLetterState,
} = useLetterState({ name });

const {
  startRevealInterval,
  stopRevealInterval,
  revealIfCorrectLetter,
  revealNextHiddenLetter,
} = useReveal({
  hiddenEntries,
  addPoint: gameStore.addPoint,
  updateLetterState,
});

const end = () => {
  const solvedLetters = numberOfSolvedLetters.value;
  const solvedAtLeastOneLetter = solvedLetters > 0;
  if (solvedAtLeastOneLetter) {
    useParty().sparkles(solvedLetters);
  }

  gameStore.addToPlayed(gameStore.node!, solvedAtLeastOneLetter);

  stopRevealInterval();
};

const nextNode = () => {
  gameStore.fetchRandomNode();
};

watch(isSolved, (newIsSolved) => {
  if (newIsSolved) {
    end();
  }
});

const onUserKeyStroke = (e: KeyboardEvent) => {
  if (isSolved.value) {
    if (e.key === "Enter") {
      nextNode();
    }
    return;
  }

  if (e.key === "Enter") {
    revealNextHiddenLetter(nextHiddenLetter.value);
    return;
  }

  if (e.key.length > 1) return;

  revealIfCorrectLetter(e.key, nextHiddenLetter.value);
};

onMounted(() => {
  watch(
    () => props.name,
    () => {
      startRevealInterval();
    },
    { immediate: true },
  );

  onKeyStroke(onUserKeyStroke);
});

onUnmounted(() => {
  stopRevealInterval();
});
</script>

<template>
  <ProgressBar compact :percentage="percentage" />

  <div class="node-name">
    <LetterContainer
      v-for="{ index, letter, state } in letterAndState"
      :key="`${index}-${letter}`"
      :letter="letter"
      :state="state"
      :focused="nextHiddenLetter?.index === index"
    />
  </div>

  <menu>
    <span class="points"
      >Points: {{ gameStore.points }} - Level {{ gameStore.level }}</span
    >
    <Button
      v-if="!isSolved"
      compact
      with-border
      @click="revealNextHiddenLetter(nextHiddenLetter)"
    >
      No idea, please help <kbd>Enter</kbd>
    </Button>
    <Button v-else compact primary @click="nextNode">
      Next node <kbd>Enter</kbd>
    </Button>
  </menu>
</template>

<style scoped>
.progress-bar-wrapper {
  margin-bottom: 20px;
}

.node-name {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 20px 5px;
  margin-bottom: 40px;
}

.input-wrapper {
  margin-bottom: 20px;
}

menu {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  padding-inline-start: 0;

  & .points {
    font-size: 18px;
    color: var(--knime-masala);
    font-weight: 800;
  }
}
</style>
