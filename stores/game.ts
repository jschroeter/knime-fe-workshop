import { defineStore } from "pinia";
import type { Node } from "~/shared/types";

type PlayedNode = Node & {
  solved: boolean;
};

export const useGameStore = defineStore("game", () => {
  /* state */

  const node = ref<Node>();
  const playedNodes = ref<PlayedNode[]>([]);
  const points = ref(0);

  /* computed state */

  const score = computed(() => {
    return playedNodes.value.reduce((acc, n) => acc + (n.solved ? 1 : 0), 0);
  });

  const level = computed(() => {
    return Math.min(10, Math.floor(score.value / 10) + 1);
  });

  /* actions */

  const fetchRandomNode = async () => {
    node.value = await $fetch("/bff/randomNode", {
      query: {
        level: level.value,
      },
    });
    return true; // just that useAsyncData doesn't complain
  };

  const addToPlayed = (node: Node, solved: boolean) => {
    playedNodes.value.push({ ...node, solved });
  };

  const addPoint = () => {
    points.value++;
  };

  return {
    node,
    playedNodes,
    /** sum of correctly guessed letters */
    points,
    /** sum of nodes with at least one correctly guessed letter */
    score,
    /** level 1 means first 10% of top nodes, level 10 means 100% */
    level,

    fetchRandomNode,
    addToPlayed,
    addPoint,
  };
});
