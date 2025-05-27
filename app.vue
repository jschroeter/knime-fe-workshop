<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  title: "Game of Nodes",
  meta: [
    {
      name: "description",
      content: "A fun game to guess KNIME nodes!",
    },
  ],
  link: [
    {
      rel: "icon",
      sizes: "any",
      type: "image/svg+xml",
      href: "/favicon.svg",
    },
  ],
});
</script>
