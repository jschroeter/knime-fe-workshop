<script setup lang="ts">
import { Button } from "@knime/components";

definePageMeta({ layout: "with-header" });

const navigation = [
  {
    id: 1,
    to: "/game",
    label: "Start Game",
    style: { primary: true },
  },
  {
    id: 2,
    to: "/",
    label: "Options",
    disabled: true,
    style: { "with-border": true },
  },
  {
    id: 3,
    to: "/",
    label: "Extras",
    disabled: true,
    style: { "with-border": true },
  },
  {
    id: 4,
    to: "/",
    label: "Credits",
    disabled: true,
    style: { "with-border": true },
  },
];
</script>

<template>
  <menu>
    <!-- eslint-disable-next-line vue/html-self-closing -->
    <img src="/public/KNIME_Logo_gray.svg" alt="KNIME Logo" />
    <RouterLink v-for="item in navigation" :key="item.id" :to="item.to">
      <Button v-bind="item.style" :disabled="item.disabled">{{
        item.label
      }}</Button>
    </RouterLink>
  </menu>
</template>

<style scoped>
menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  margin-top: 40px;
  width: 200px;
  padding-inline-start: 0;

  & img {
    width: 200px;
    height: auto;
    margin-bottom: 20px;
  }

  & a,
  .button {
    width: 200px;
  }
}
</style>
