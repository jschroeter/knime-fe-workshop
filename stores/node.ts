import { defineStore } from "pinia";
import type { Node } from "~/shared/types";

type SolvedNode = Node & {
  solved: boolean;
};

export const useNodeStore = defineStore("node", () => {
  const node = ref<Node>();
  const trash = ref<Array<SolvedNode>>([]);

  const fetch = async () => {
    node.value = await $fetch("/bff/randomNode");
  };

  const addToTrash = (node: Node, solved: boolean) => {
    trash.value.push({ ...node, solved });
  };

  return {
    addToTrash,
    trashedNodes: trash,
    node,
    fetch,
    score: computed(() => {
      return trash.value.reduce((acc, n) => acc + (n.solved ? 1 : 0), 0);
    }),
  };
});
