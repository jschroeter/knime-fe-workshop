<script setup lang="ts">
import { defineProps, onMounted, useTemplateRef } from "vue";
import isWhiteSpace from "../utils/isWhiteSpace";
import { Button, Label, InputField } from "@knime/components";
import party from "party-js";

const props = defineProps<{
  name: string;
}>();

const letterStateMap = ref(new Map<string, "hidden" | "revealed">());
const dialogRef = ref<HTMLDialogElement | null>(null);
const nodeNameRef = useTemplateRef("nodeName");
const playerGuess = ref("");

const letterAndState = computed(() => {
  return Array.from(letterStateMap.value.entries()).map(
    ([index, { letter, state }]) => ({
      index,
      letter,
      state,
    })
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

let revealInterval: ReturnType<typeof setInterval>;
const revealTime = 3 * 1000;

const startRevealInterval = () => {
  revealInterval = setInterval(() => {
    const hiddenEntries = Array.from(letterStateMap.value.entries()).filter(
      ([_, value]) => value.state === "hidden"
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
};

const solve = () => {
  stopRevealInterval();
  dialogRef.value?.showModal();
};

const onDialogSubmit = () => {
  const answer = playerGuess.value.trim().toLowerCase();
  const expected = props.name.trim().toLowerCase();

  if (answer === expected) {
    revealAll();
    party.confetti(nodeNameRef.value, {
      count: party.variation.range(20, 40),
      size: party.variation.range(0.8, 1.2),
    });
  } else {
    startRevealInterval();
  }

  playerGuess.value = "";
  dialogRef.value?.close();
};

const isSolved = computed(() => {
  return Array.from(letterStateMap.value.values()).every(
    (entry) => entry.state === "revealed"
  );
});

watch(
  () => props.name,
  () => {
    initializeLetterStateMap();
    onMounted(() => {
      startRevealInterval();
    });
  },
  { immediate: true }
);

onUnmounted(() => {
  stopRevealInterval();
});
</script>

<template>
  <div ref="nodeName" class="node-name">
    <LetterContainer
      v-for="{ index, letter, state } in letterAndState"
      :key="`${index}-${letter}`"
      :letter="letter"
      :state="state"
    />
  </div>

  <Button v-if="!isSolved" primary @click="solve"> Solve </Button>

  <dialog ref="dialogRef">
    <form method="dialog" @submit.prevent="onDialogSubmit">
      <Label text="Hi, my name is">
        <InputField v-model="playerGuess" type="text" />
      </Label>

      <menu>
        <Button compact with-border @click="dialogRef?.close()">Cancel</Button>
        <Button compact primary type="submit">Submit</Button>
      </menu>
    </form>
  </dialog>
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
  background-color: rgba(0, 0, 0, 0.5); /* semi-transparent black */
  backdrop-filter: blur(4px); /* optional: adds blur for a polished look */
}
</style>
