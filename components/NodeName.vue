<script setup lang="ts">
import { onMounted } from "vue";
import isWhiteSpace from "../utils/isWhiteSpace";
import { Button, ProgressBar } from "@knime/components";

import { onKeyStroke } from "@vueuse/core";
import { useGameStore } from "../stores/game";

type LetterState = {
  letter: string;
  state: "hidden" | "revealed";
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

const initializeLetterStateMap = () => {
  letterStateMap.value.clear();

  props.name.split("").forEach((letter, index) => {
    letterStateMap.value.set(index, {
      letter,
      state: isWhiteSpace(letter) ? "revealed" : "hidden",
    });
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
    (entry) => entry.state === "revealed",
  );
});

watch(playerGuess, (newPlayerGuess) => {
  const answer = newPlayerGuess.replace(/\s+/g, "").toLowerCase();
  const expected = props.name.replace(/\s+/g, "").toLowerCase();

  if (answer === expected) {
    solve();
    revealAll(true);
  }
});

const revealCorrectLetters = () => {
  // TODO ignore whitespaces (and ideally all non-alphabetical characters?), it shouldn't matter if the user types them or not
  const guess = playerGuess.value.toLowerCase();
  const name = props.name.toLowerCase();

  if (guess.length === 0) return;

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

const onUserKeyStroke = (e) => {
  if (isSolved.value) {
    if (e.key === "Enter") {
      nextNode();
    }
    return;
  }

  if (e.key === "Escape") {
    if (!isSolved.value) {
      revealAll();
      return;
    }
  }

  if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
  if (e.key.length > 1 && e.key !== "Backspace") return;

  e.preventDefault();

  if (e.key === "Backspace") {
    playerGuess.value = playerGuess.value.slice(0, -1);
  } else {
    playerGuess.value += e.key;
  }

  revealCorrectLetters();
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
    />
  </div>

  <div class="hint">
    Just start typing the name of the node
    <span>{{ isSolved ? name : playerGuess }}</span>
  </div>

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

.hint {
  font-size: 14px;
  color: var(--knime-gray);
  margin-bottom: 20px;
  border-color: var(--knime-cornflower);
  background-color: var(--knime-cornflower-ultra-light);
  font-size: 12px;
  line-height: 14px;
  border-left-width: 2px;
  border-left-style: solid;
  padding: 10px;

  & span {
    font-weight: bold;
    color: var(--knime-masala);
  }
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
