<script setup lang="ts">
import { type Node, useNodeStore } from "../stores/node";
import { Pill } from "@knime/components";

defineProps<{
  node: Node;
}>();

const nodeStore = useNodeStore();
</script>

<template>
  <div class="node-container">
    <div class="icon">
      <img :src="node.preview" />
      <div class="node-type">{{ node.type }}</div>
    </div>

    <div class="text">
      <NodeName :name="node.title" />
    </div>
  </div>

  <div class="trashed-nodes">
    <Pill
      v-for="trashedNode in nodeStore.trashedNodes"
      :key="trashedNode.url"
      :variant="trashedNode.solved ? 'light' : 'error'"
    >
      <NuxtLink external target="_blank" :to="trashedNode.url">{{
        trashedNode.title
      }}</NuxtLink></Pill
    >
  </div>
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

.trashed-nodes {
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
