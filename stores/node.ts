import { defineStore } from "pinia";

export type Node = {
  title: string;
  string: string;
  type: string;
  preview: string;
  url: string;
};

export const useNodeStore = defineStore("node", () => {
  const node = ref<Node>();

  const fetch = async () => {
    node.value = await $fetch<Node>("/bff/randomNode");
  };

  return {
    node,
    fetch,
  };
});
