<script setup lang="ts">
import type { Node } from "../stores/node";

defineProps<{
  node: Node;
}>();
</script>

<template>
  <div class="node-container">
    <div class="icon">
      <!-- eslint-disable-next-line vue/html-self-closing -->
      <img :src="node.preview" />
      <div class="node-type">{{ node.type }}</div>
    </div>

    <div class="text">
      <NodeName :name="node.title" />
    </div>
  </div>
  <p>
    <NuxtLink external target="_blank" :to="node.url"
      >Show node on KNIME Hub</NuxtLink
    >
  </p>
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

  & .text {
    padding: 20px;
  }

  & .icon {
    flex: 0 0 100px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
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
      height: auto;
    }
  }
}

p {
  text-align: right;
}
</style>
