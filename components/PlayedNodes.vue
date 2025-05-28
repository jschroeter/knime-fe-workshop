<script setup lang="ts">
import { Pill } from "@knime/components";

const gameStore = useGameStore();
</script>

<template>
  <div class="played-nodes">
    <Pill
      v-for="playedNode in gameStore.playedNodes"
      :key="playedNode.id"
      :variant="playedNode.solved ? 'light' : 'error'"
    >
      <NuxtLink external target="_blank" :href="playedNode.url">{{
        playedNode.title
      }}</NuxtLink></Pill
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

  & .pill {
    padding: 3px 10px;

    & a {
      text-decoration: none;
    }
  }
}
</style>
