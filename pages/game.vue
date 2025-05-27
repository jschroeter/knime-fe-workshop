<script setup lang="ts">
import { useNodeStore } from "~/stores/node";

definePageMeta({ layout: "with-header" });

const nodeStore = useNodeStore();
await useAsyncData("randomNode", () => nodeStore.fetch());

const node = computed(() => nodeStore.node);
</script>

<template>
  <div>
    <NodeContainer v-if="node" :node="node" />
  </div>
</template>
