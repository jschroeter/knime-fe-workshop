<script setup lang="ts">
import isWhiteSpace from "~/utils/isWhiteSpace";

defineProps<{
  letter: string;
  state: "hidden" | "special" | "revealed" | "solved";
  focused?: boolean;
}>();
</script>

<template>
  <div
    class="letter"
    :class="[
      state,
      {
        flipped:
          state === 'revealed' || state === 'solved' || state === 'special',
        transparent: isWhiteSpace(letter),
        special: state === 'special',
        focused: focused,
      },
    ]"
  >
    <div class="card">
      <div class="face front"></div>
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

  /* bottom shadow */
  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 0;
    height: 5px;
    width: 100%;
    background-color: var(--knime-masala);
  }

  &.transparent,
  &.transparent::after {
    opacity: 0;
  }

  & .card {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 0.6s cubic-bezier(0.25, 1.5, 0.5, 1);
  }

  &.flipped .card {
    transform: rotateY(180deg);
  }

  & .face {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.4em;
    font-weight: 800;
    text-transform: uppercase;
    transition:
      background-color 0.3s ease,
      color 0.3s ease;
    text-shadow: 1px 2px 0px white;
    letter-spacing: 1px;

    &.front {
      background-color: var(--knime-yellow);
      color: transparent;
    }

    &.back {
      background-color: var(--knime-stone-light);
      color: hsl(12, 4.2%, 23.3%);
      transform: rotateY(180deg);
    }
  }

  &.special {
    & .face.back {
      background-color: var(--knime-porcelain);
      color: var(--knime-silver-sand);
    }
  }

  &.focused {
    transform: scale(1.3);

    &::after {
      background-color: var(--knime-yellow);
    }

    & .face.front {
      animation: pulse 0.4s infinite alternate;
    }
  }
}

@keyframes pulse {
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
