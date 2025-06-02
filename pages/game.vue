<script setup lang="ts">
const gameStore = useGameStore();
const node = computed(() => gameStore.node);

await useAsyncData(() => gameStore.fetchRandomNode());
</script>

<template>
  <NodeContainer v-if="node" :node="node" />
</template>
