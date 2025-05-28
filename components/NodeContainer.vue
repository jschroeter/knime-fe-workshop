<script setup lang="ts">
import type { Node } from "~/shared/types";

defineProps<{
  node: Node;
}>();
</script>

<template>
  <div class="node-container">
    <div class="icon">
      <img :src="node.preview" />
      <div class="node-type">{{ node.nodeType }}</div>
    </div>

    <div class="name">
      <NodeName :name="node.title" />
    </div>
  </div>

  <PlayedNodes />
</template>

<style scoped>
.node-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
  background-color: var(--knime-white);
  height: 100%;
  max-width: 800px;

  & .name {
    padding: 20px;
  }

  & .icon {
    flex: 0 0 100px;
    display: flex;
    flex-direction: column;
    align-self: stretch;
    padding: 7px;
    background-color: var(--knime-gray-light-semi);
    font-size: 13px;

    & .node-type {
      text-align: center;
      white-space: normal;
      overflow-wrap: anywhere;
      max-width: 100%;
    }

    & img {
      width: 140px;
      aspect-ratio: 1 / 1;
    }
  }
}
</style>
