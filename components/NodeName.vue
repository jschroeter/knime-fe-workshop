<script setup lang="ts">
import { defineProps, onMounted } from "vue";
import isWhiteSpace from "../utils/isWhiteSpace";
import { Button, ProgressBar } from "@knime/components";
import knimeTriangle from "@knime/styles/img/KNIME_Triangle.svg?url";
import party from "party-js";
import { onKeyStroke } from "@vueuse/core";
import { useNodeStore } from "../stores/node";

type LetterState = {
  letter: string;
  state: "hidden" | "revealed";
};

const props = defineProps<{
  name: string;
}>();

const nodeStore = useNodeStore();

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

const revealAll = () => {
  for (const [index, entry] of letterStateMap.value.entries()) {
    letterStateMap.value.set(index, { ...entry, state: "revealed" });
  }
};

const solve = () => {
  party.resolvableShapes["knime"] = `<img src="${knimeTriangle}"/>`;
  party.sparkles(document.body, {
    count: party.variation.range(20, 50),
    size: party.variation.range(0.1, 0.2),
    shapes: ["knime"],
  });

  stopRevealInterval();
};

const nextNode = () => {
  nodeStore.fetch();
};

const isSolved = computed(() => {
  return Array.from(letterStateMap.value.values()).every(
    (entry) => entry.state === "revealed",
  );
});

const startTimeout = ref<NodeJS.Timeout | undefined>();

watch(playerGuess, (newPlayerGuess) => {
  const answer = newPlayerGuess.replace(/\s+/g, "").toLowerCase();
  const expected = props.name.replace(/\s+/g, "").toLowerCase();

  if (answer === expected) {
    revealAll();
    solve();
  }
});

const revealCorrectLetters = () => {
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
  if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
  if (e.key.length > 1 && e.key !== "Backspace") return;

  e.preventDefault();
  window.clearTimeout(startTimeout.value);

  if (e.key === "Backspace") {
    playerGuess.value = playerGuess.value.slice(0, -1);
  } else {
    playerGuess.value += e.key;
  }

  revealCorrectLetters();

  startTimeout.value = setTimeout(() => {
    playerGuess.value = "";
  }, 2000);
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

  <p class="hint">
    Just start typing the name of the node <span>{{ playerGuess }}</span>
  </p>

  <menu>
    <Button v-if="!isSolved" with-border @click="revealAll">
      No idea, please reveal
    </Button>
    <Button v-else with-border @click="nextNode"> Next node </Button>
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
  justify-content: flex-start;
  padding-inline-start: 0;
}

dialog {
  width: 300px;
  padding: 20px;
  padding-bottom: 5px;
  border: none;
  background-color: var(--knime-white);

  & menu {
    display: flex;
    gap: 10px;
    justify-content: end;
    margin-top: 20px;
  }
}

dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}
</style>
