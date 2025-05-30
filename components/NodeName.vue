<script setup lang="ts">
import { onMounted } from "vue";

import { Button, ProgressBar } from "@knime/components";

import { onKeyStroke } from "@vueuse/core";
import { useGameStore } from "../stores/game";
import { useLetterState } from "~/composable/useLetterState";

const props = defineProps<{
  name: string;
}>();

const gameStore = useGameStore();

const {
  letterStateMap,
  letterAndState,
  nextHiddenLetter,
  nextHiddenLetterIndex,
  numberOfSolvedLetters,
  initializeLetterStateMap,
} = useLetterState({ name: props.name });

let revealInterval: ReturnType<typeof setInterval> | undefined;
const revealTime = 3 * 1000;

// TODO pause the interval while the user is typing
const startRevealInterval = () => {
  stopRevealInterval();
  revealInterval = setInterval(() => {
    const hiddenEntries = Array.from(letterStateMap.value.entries()).filter(
      ([_, value]) => value.state === "hidden",
    );

    if (hiddenEntries.length === 0) {
      clearInterval(revealInterval);
      return;
    }

    const [randomIndex, entry] =
      hiddenEntries[Math.floor(Math.random() * hiddenEntries.length)];

    letterStateMap.value.set(randomIndex, {
      ...entry,
      state: "revealed",
    });
  }, revealTime);
};

const percentage = computed(() => {
  const totalLetters = letterStateMap.value.size;
  const hiddenLetters = Array.from(letterStateMap.value.values()).filter(
    (entry) => entry.state === "hidden",
  ).length;

  return totalLetters > 0
    ? ((totalLetters - hiddenLetters) / totalLetters) * 100
    : 0;
});

const stopRevealInterval = () => {
  if (revealInterval) {
    clearInterval(revealInterval);
    revealInterval = undefined;
  }
};

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
  gameStore.fetch();
};

const isSolved = computed(() => {
  return !Array.from(letterStateMap.value.values()).find(
    (entry) => entry.state === "hidden",
  );
});

watch(isSolved, (newIsSolved) => {
  if (newIsSolved) {
    end();
  }
});

const revealIfCorrectLetter = (guessedLetter: string) => {
  guessedLetter = guessedLetter.toLowerCase();
  const actualLetterObject = nextHiddenLetter.value;
  const actualLetter = actualLetterObject.letter.toLowerCase();

  if (guessedLetter === actualLetter) {
    letterStateMap.value.set(actualLetterObject.index, {
      ...actualLetterObject,
      state: "solved",
    });
    gameStore.addPoint();
  }
};

const revealNextHiddenLetter = () => {
  const nextHiddenLetterObject = nextHiddenLetter.value;

  letterStateMap.value.set(nextHiddenLetterObject.index, {
    ...nextHiddenLetterObject,
    state: "revealed",
  });
};

const onUserKeyStroke = (e: KeyboardEvent) => {
  if (isSolved.value) {
    if (e.key === "Enter") {
      nextNode();
    }
    return;
  }

  if (e.key === "Enter") {
    revealNextHiddenLetter();
    return;
  }

  if (e.key.length > 1) return;

  revealIfCorrectLetter(e.key);
};

watch(
  () => props.name,
  (newName: string) => {
    initializeLetterStateMap({ name: newName });
  },
  { immediate: true },
);

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
      :focused="nextHiddenLetterIndex === index"
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
      @click="revealNextHiddenLetter()"
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
