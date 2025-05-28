<script setup lang="ts">
const gameStore = useGameStore();
</script>

<template>
  <div class="played-nodes">
    <NuxtLink
      v-for="playedNode in gameStore.playedNodes"
      :key="playedNode.id"
      :class="[{ unsolved: !playedNode.solved }]"
      external
      target="_blank"
      :href="playedNode.url"
      >{{ playedNode.title }}</NuxtLink
    >
  </div>
</template>

<style scoped>
.played-nodes {
  padding: 20px 0;
  flex: 0 0 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  max-width: 800px;

  & a {
    font-size: 14px;
    padding: 3px 5px;
    text-decoration: none;
    border: 1px solid var(--knime-dove-gray);
    color: var(--knime-dove-gray);
    display: inline-block;
    font-weight: 500;
    line-height: 17px;
    margin-bottom: 5px;
    margin-right: 5px;
    transition:
      border-color,
      background-color 0.05s ease-in-out;

    &:hover {
      background: var(--knime-masala);
      border-color: var(--knime-masala);
      color: var(--knime-white);
    }

    &.unsolved {
      border: 1px solid var(--knime-coral-dark);
      color: var(--knime-coral-dark);

      &:hover {
        background: var(--knime-coral-dark);
        border-color: var(--knime-coral-dark);
        color: var(--knime-white);
      }
    }
  }
}
</style>
