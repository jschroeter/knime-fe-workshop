<script setup lang="ts">
import isWhiteSpace from "../utils/isWhiteSpace";

defineProps<{
  letter: string;
  state: "hidden" | "revealed";
}>();
</script>

<template>
  <div
    class="letter"
    :class="[
      state,
      { flipped: state === 'revealed', transparent: isWhiteSpace(letter) },
    ]"
  >
    <div class="card">
      <div class="face front" />
      <div class="face back">
        <span>{{ letter }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.letter {
  perspective: 800px;
  width: 36px;
  height: 72px;
  display: inline-block;
  margin: 4px;
}

.card {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.25, 1.5, 0.5, 1);
}

.letter.flipped .card {
  transform: rotateY(180deg);
}

.face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 2.4em;
  font-weight: 800;
  text-transform: uppercase;
  transition: background-color 0.3s ease, color 0.3s ease;
  text-shadow: 1px 2px 0px white;
  letter-spacing: 1px;
}

.front {
  background-color: var(--knime-yellow);
  color: transparent;
}

.back {
  background-color: var(--knime-stone-light);
  color: hsl(12, 4.2%, 23.3%);
  transform: rotateY(180deg);
}

/* Optional bottom shadow */
.letter::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 0;
  height: 5px;
  width: 100%;
  background-color: hsl(12, 4.2%, 23.3%);
}

.letter.transparent,
.letter.transparent::after {
  opacity: 0;
}
</style>
