<script setup lang="ts">
import { onMounted, useTemplateRef } from "vue";
import isWhiteSpace from "../utils/isWhiteSpace";
import isSpecialCharacter from "../utils/isSpecialCharacter";
import { Button, ProgressBar, InputField } from "@knime/components";

import { onStartTyping } from "@vueuse/core";
import { useGameStore } from "../stores/game";

type LetterState = {
  letter: string;
  state: "hidden" | "revealed" | "special";
};

const props = defineProps<{
  name: string;
}>();

const gameStore = useGameStore();

const letterStateMap = ref(new Map<number, LetterState>());
const playerGuess = ref("");

const letterAndState = computed(() => {
  return Array.from(letterStateMap.value.entries()).map(
    ([index, { letter, state }]) => ({
      index,
      letter,
      state,
    }),
  );
});

const getLetterState = (letter: string): LetterState => {
  switch (true) {
    case isWhiteSpace(letter):
      return { letter, state: "revealed" };
    case isSpecialCharacter(letter):
      return { letter, state: "special" };
    default:
      return { letter, state: "hidden" };
  }
};
const initializeLetterStateMap = () => {
  letterStateMap.value.clear();

  props.name.split("").forEach((letter, index) => {
    letterStateMap.value.set(index, getLetterState(letter));
  });
};

let revealInterval: ReturnType<typeof setInterval> | undefined;
const revealTime = 3 * 1000;

// TODO pause the interval when the user is typing
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
  const revealedLetters = Array.from(letterStateMap.value.values()).filter(
    (entry) => entry.state === "revealed",
  ).length;

  return totalLetters > 0 ? (revealedLetters / totalLetters) * 100 : 0;
});

const stopRevealInterval = () => {
  if (revealInterval) {
    clearInterval(revealInterval);
    revealInterval = undefined;
  }
};

const revealAll = (solved = false) => {
  for (const [index, entry] of letterStateMap.value.entries()) {
    letterStateMap.value.set(index, { ...entry, state: "revealed" });
  }
  gameStore.addToPlayed(gameStore.node!, solved);
};

const solve = () => {
  useParty().sparkles();
  stopRevealInterval();
};

const nextNode = () => {
  playerGuess.value = "";
  gameStore.fetch();
};

const isSolved = computed(() => {
  return Array.from(letterStateMap.value.values()).every(
    (entry) => entry.state === "revealed" || entry.state === "special",
  );
});

const normalize = (str: string) => str.replace(/[^a-z]/gi, "").toLowerCase();
const isGuessCorrect = (guess: string, actual: string) =>
  normalize(guess) === normalize(actual);

watch(playerGuess, (newPlayerGuess) => {
  if (isGuessCorrect(newPlayerGuess, props.name)) {
    solve();
    revealAll(true);
  }
  revealCorrectLetters();
});

const revealCorrectLetters = () => {
  if (playerGuess.value.length === 0) return;

  const guess = playerGuess.value.toLowerCase();
  const name = props.name.toLowerCase();

  letterStateMap.value.forEach((entry, index) => {
    if (
      entry.state === "hidden" &&
      guess[index] &&
      guess[index] === name[index]
    ) {
      letterStateMap.value.set(index, { ...entry, state: "revealed" });
    }
  });
};

const input = useTemplateRef("input");
const onTyping = () => {
  if (!input.value?.active) {
    input.value?.focus();
  }
};

watch(
  () => props.name,
  () => {
    initializeLetterStateMap();
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

  onStartTyping(onTyping);
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
    />
  </div>

  <InputField
    ref="input"
    v-model="playerGuess"
    type="text"
    placeholder="Just start typing the name of the node…"
  />

  <menu>
    <!-- TODO instead of score, give 1 point for each correctly guessed character? -->
    <span class="score"
      >Score: {{ gameStore.score }} - Level {{ gameStore.level }}</span
    >
    <Button v-if="!isSolved" compact with-border @click="revealAll(false)">
      No idea, please reveal <kbd>ESC</kbd>
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

  & .score {
    font-size: 18px;
    color: var(--knime-masala);
    font-weight: 800;
  }
}
</style>
