<template>
  <div>
    <header>
      <h2>
        <img src="/public/KNIME_Logo_gray.svg" alt="KNIME Logo" />
        Game of Nodes
      </h2>
    </header>
    <nav></nav>
    <main>
      <slot></slot>
    </main>
  </div>
</template>

<style scoped>
header {
  place-items: center;
  padding: 20px;
  background-color: var(--knime-white);

  & h2 {
    padding: 0;
    margin: 0;
    display: flex;
    place-items: center;
    gap: 30px;
  }

  & img {
    width: 200px;
    height: auto;
    margin-bottom: 20px;
  }
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
