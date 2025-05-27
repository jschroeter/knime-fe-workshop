<script setup lang="ts">
import { Pill } from "@knime/components";

const nodeStore = useNodeStore();
</script>

<template>
  <div class="trashed-nodes">
    <Pill
      v-for="trashedNode in nodeStore.trashedNodes"
      :key="trashedNode.id"
      :variant="trashedNode.solved ? 'light' : 'error'"
    >
      <NuxtLink external target="_blank" :href="trashedNode.url">{{
        trashedNode.title
      }}</NuxtLink></Pill
    >
  </div>
</template>

<style scoped>
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
