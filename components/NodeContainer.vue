<script setup lang="ts">
import NodeName from "./NodeName";

const props = defineProps<{
  node: Node;
}>();
</script>

<template>
  <div class="node-container">
    <div class="icon">
      <img :src="props.node.preview" />
      <div class="node-type">{{ props.node.type }}</div>
    </div>

    <div class="text">
      <NodeName :name="props.node.title" />
      <p>TODO link to Hub</p>
    </div>
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

    & .preview {
      margin-top: -10px;
      margin-bottom: -10px;
      width: 180px;
      height: 180px;
    }
  }
}
</style>
