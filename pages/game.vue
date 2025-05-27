<script setup lang="ts">
import NodeContainer from "../components/NodeContainer.vue";
import type { NodeList } from "../components/node.types.ts";

definePageMeta({ layout: "with-header" });

type Player = {
  name: string;
  score: number;
};
type Players = Player[];

const players: Players = ref([
  {
    name: "Player 1",
    score: 0,
  },
]);

const {
  data: node,
  status,
  error,
  refresh,
} = await useAsyncData("randomNode", () => $fetch("/bff/randomNode"));
</script>

<template>
  <div>
    <p>Just start typing the name of the node. Or enable speech recognition.</p>
    <div v-for="i in players.length" :key="i" class="player-container">
      <NodeContainer :node="node" @next-node="refresh" />
    </div>
  </div>
</template>
