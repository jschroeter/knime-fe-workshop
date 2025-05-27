<script setup lang="ts">
import { defineProps, onMounted } from "vue";
import isWhiteSpace from "../utils/isWhiteSpace";
import { Button, ProgressBar } from "@knime/components";
import knimeTriangle from "@knime/styles/img/KNIME_Triangle.svg?url";
import party from "party-js";
import { onKeyStroke, useInterval, useSpeechRecognition } from "@vueuse/core";

const props = defineProps<{
  name: string;
}>();

const emit = defineEmits(["nextNode"]);

const letterStateMap = ref(new Map<string, "hidden" | "revealed">());
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

const {
  counter: progress,
  reset,
  resume,
  pause,
} = useInterval(100, {
  controls: true,
  immediate: false,
});
const progressToNextNode = () => {
  reset();
  resume();
};

watch(progress, (newProgress) => {
  if (newProgress >= 10) {
    pause();
    emit("nextNode");
    console.log("Progress to next node");
  }
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

let revealInterval: ReturnType<typeof setInterval>;
const revealTime = 3 * 1000;

const startRevealInterval = () => {
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

const stopRevealInterval = () => {
  if (revealInterval) {
    clearInterval(revealInterval);
    revealInterval = null;
  }
};

const revealAll = () => {
  for (const [index, entry] of letterStateMap.value.entries()) {
    letterStateMap.value.set(index, { ...entry, state: "revealed" });
  }
  progressToNextNode();
};

const solve = () => {
  party.resolvableShapes["knime"] = `<img src="${knimeTriangle}"/>`;
  party.sparkles(document.body, {
    count: party.variation.range(20, 50),
    size: party.variation.range(0.1, 0.2),
    shapes: ["knime"],
  });

  stopRevealInterval();
  playerGuess.value = "";

  progressToNextNode();
};

const isSolved = computed(() => {
  return Array.from(letterStateMap.value.values()).every(
    (entry) => entry.state === "revealed",
  );
});

const startTimeout = ref<NodeJS.Timeout | null>(null);

const { isSupported, isListening, isFinal, result, start, stop } =
  useSpeechRecognition({ lang: "en-US" });

watch(
  () => props.name,
  () => {
    initializeLetterStateMap();
    onMounted(() => {
      startRevealInterval();

      onKeyStroke(
        (e) => {
          window.clearTimeout(startTimeout.value);
          if (e.key.length === 1) {
            playerGuess.value = playerGuess.value + e.key;
          }
          startTimeout.value = setTimeout(() => {
            playerGuess.value = "";
          }, 2000);
        },
        { dedupe: true },
      );
    });
  },
  { immediate: true },
);

watch(playerGuess, (newPlayerGuess) => {
  const answer = newPlayerGuess.replace(/\s+/g, "").toLowerCase();
  const expected = props.name.replace(/\s+/g, "").toLowerCase();

  if (answer === expected) {
    revealAll();
    solve();
  }
});

watch(result, (newResult) => {
  const answer = newResult.replace(/\s+/g, "").toLowerCase();
  const expected = props.name.replace(/\s+/g, "").toLowerCase();

  if (answer.includes(expected)) {
    revealAll();
    solve();
  }
});

onUnmounted(() => {
  stopRevealInterval();
});
</script>

<template>
  <div class="node-name">
    <LetterContainer
      v-for="{ index, letter, state } in letterAndState"
      :key="`${index}-${letter}`"
      :letter="letter"
      :state="state"
    />
  </div>

  <Button v-if="!isSolved" with-border compact @click="revealAll">
    No idea, please reveal
  </Button>
  <ProgressBar v-if="isSolved" :percentage="progress * 10" compact />

  <br /><br /><br />
  <Button
    v-if="isSupported"
    primary
    compact
    @click="isListening ? stop() : start()"
  >
    {{ isListening ? "stop" : "start" }} speech recognition
  </Button>

  <br />
  Typed: {{ playerGuess }}<br />
  Speech recognition: {{ result }}<br />
</template>

<style scoped>
.node-name {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 20px 5px;
  min-height: 120px;
  margin-bottom: 40px;
}
</style>
