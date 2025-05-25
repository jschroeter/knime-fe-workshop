<template>
  <div>
    <header>Game of Nodes</header>
    <nav />
    <main>
      <slot />
    </main>
  </div>
</template>

<style scoped>
header {
  font-size: 4em;
  text-align: center;
  padding: 50px;
  font-family: Helvetica, Arial, sans-serif;
  font-weight: 800;
  text-transform: uppercase;
  background-color: var(--knime-white);
}
nav {
  height: 60px;
  background-color: var(--knime-gray-ultra-light);
}
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
}
</style>
