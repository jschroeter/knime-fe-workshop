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
      content: "Become a true KNIME node master!",
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
