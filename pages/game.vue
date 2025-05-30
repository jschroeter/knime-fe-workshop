<script setup lang="ts">
import { useGameStore } from "~/stores/game";

const gameStore = useGameStore();
const node = computed(() => gameStore.node);

gameStore.fetchRandomNode();
</script>

<template>
  <NodeContainer v-if="node" :node="node" />
</template>
