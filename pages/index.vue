<script setup lang="ts">
import { Button } from "@knime/components";

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
  <div class="container">
    <p>
      <strong>Welcome to the ultimate KNIME challenge!</strong><br />
      Test your knowledge and intuition in this exciting hangman-style game. Can
      you guess the node just by its icon? Recognize them all before your
      chances run out! Sharpen your skills, compete with friends, and become a
      true KNIME node master!
    </p>
    <menu>
      <Button
        v-for="item in navigation"
        :key="item.id"
        :to="item.to"
        v-bind="item.style"
        :disabled="item.disabled"
        >{{ item.label }}</Button
      >
    </menu>
  </div>
</template>

<style scoped>
.container {
  place-items: center;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  width: 80%;
  max-width: 800px;
}

p {
  line-height: 160%;
}

menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  margin-top: 40px;
  padding-inline-start: 0;
  width: 200px;
}
</style>
