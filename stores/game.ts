import { defineStore } from "pinia";
import type { Node } from "~/shared/types";

type PlayedNode = Node & {
  solved: boolean;
};

export const useGameStore = defineStore("game", () => {
  const node = ref<Node>();
  const playedNodes = ref<PlayedNode[]>([]);
  const points = ref(0);

  /** the score is just a sum of correctly guessed nodes */
  const score = computed(() => {
    return playedNodes.value.reduce((acc, n) => acc + (n.solved ? 1 : 0), 0);
  });

  /** level 1 means first 10% of top nodes, level 10 means 100% */
  const level = computed(() => {
    return Math.min(10, Math.floor(score.value / 10) + 1);
  });

  const fetchRandomNode = async () => {
    node.value = await $fetch("/bff/randomNode", {
      query: {
        level: level.value,
      },
    });
  };

  const addToPlayed = (node: Node, solved: boolean) => {
    playedNodes.value.push({ ...node, solved });
  };

  const addPoint = () => {
    points.value += 1;
  };

  return {
    addToPlayed,
    playedNodes,
    node,
    fetchRandomNode,
    points,
    addPoint,
    score,
    level,
  };
});
