<script setup lang="ts">
import { useNodeStore } from "~/stores/node";

const nodeStore = useNodeStore();
await useAsyncData("randomNode", () => nodeStore.fetch());

const node = computed(() => nodeStore.node);
</script>

<template>
  <NodeContainer v-if="node" :node="node" />
</template>
