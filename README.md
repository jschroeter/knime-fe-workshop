# KNIME Game of Nodes

This is a little app used for a frontend development workshop.

### Useful links

- [Vue documentation](https://vuejs.org/guide/introduction.html)
- [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction)
- and to not reinvent the wheel:
  - [KNIME UI components overview](https://knime.github.io/webapps-common/)
    (published as [npm packages](https://www.npmjs.com/~knime))
  - [VueUse](https://vueuse.org/) collection of essential utilities

## Setup

You can choose, local setup or browser-based IDE: We recommend the local setup, but in case you struggle, just go with the browser-based one. It's a bit limited in functionality, but good enough.

### Local (recommended)

1. Make sure to have [NodeJS installed](https://knime-com.atlassian.net/wiki/spaces/SPECS/pages/905281540/Node.js+Installation) (ideally version 22, but others should work as well. Just ignore the "Unsupported engine" warning.)
2. Install [Visual Studio Code](https://code.visualstudio.com/download)
3. Fork this repo on GitHub (needed for step 5), then clone and open in VS Code
4. Accept prompt to install recommended VS Code extensions, most importantly [Vue - Official Language Support](https://marketplace.visualstudio.com/items?itemName=vue.volar)
5. Install dependencies

   ```bash
   npm install
   ```

6. Start the development server

   ```bash
   npm run dev
   ```

7. Open in your browser: http://localhost:3000/ - you should see the app homepage

### Browser-based IDE via StackBlitz, no local setup required

1. Click the following link: [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/~/github.com/jschroeter/knime-fe-workshop)
2. Accept prompts to install recommended VS Code extensions, most importantly [Vue - Official Language Support](https://marketplace.visualstudio.com/items?itemName=vue.volar)
3. After some time you should see the app homepage on the right side. You can ignore the "Unsupported engine" warnings in the terminal.
4. As soon as you want to commit your changes you'll get asked to login via GitHub to fork the repo

## Step 1: Components & Pages 🧱

- in [pages/index.vue](./pages/index.vue), render a [KNIME Button](https://knime.github.io/webapps-common/?q=Button)
  (which is just a wrapper around [NuxtLink](https://nuxt.com/docs/api/components/nuxt-link)) for each menu item
- in [pages/game.vue](./pages/game.vue), use the [NodeContainer.vue](./components/NodeContainer.vue) component
  - pass the mocked node as [prop](https://vuejs.org/guide/essentials/component-basics.html#passing-props)

You now should be able to navigate to the game and play it. Well, so far only with the one mocked node.
If not, checkout branch `step1`.

## Step 2: Data Fetching & State Management 🗄️

- in [pages/index.vue](./pages/index.vue), replace mock with the global node from [stores/game.ts](./stores/game.ts)

  - call `fetchRandomNode()` action from game store
  - if you like, wrap it with [useAsyncData](https://nuxt.com/docs/api/composables/use-async-data)
    so navigation waits until the node is loaded

    `await useAsyncData(() => gameStore.fetchRandomNode());`

- We should exclude deprecated or legacy nodes. Thankfully, we have a BFF and can do that in [shared/api/node.ts](./shared/api/node.ts). Notice the code completion due to the typed API.
  Make sure to return `null` so the response will be cached in step 4.

You now should see random nodes and be able to proceed to the next node.
If not, checkout branch `step2`.

## Step 3: Composabels and Sparkels 🎇

- Let's make the user happy if at least one letter was guessed correctly
  - in [components/NodeName.vue](./components/NodeName.vue) `watch(isSolved…`, call `useParty().sparkels()` ([composables/useParty.ts](./composables/useParty.ts))
  - if you like, use `numberOfSolvedLetters` as factor argument
- Implement feature: for each correctly guessed letter, the user should get 1 point
  - add state and action to [stores/game.ts](./stores/game.ts) and expose them
  - call action in [composables/useReveal.ts](./composables/useReveal.ts) `revealIfCorrectLetter()`
  - display the points e.g. in [components/NodeName.vue](./components/NodeName.vue)

Give it a try: can you see the fireworks? Do the points show up and increase?
If not, checkout branch `step3`.

## Step 4: Make it Scale 🌍

- add [caching via Nitro](https://nitro.build/guide/cache) in [server/routes/bff/randomNodes.ts](./server/routes/bff/randomNode.ts) for
  - `fetchTopNodes()`
  - `fetchNode()`
- in [nuxt.config.ts](./nuxt.config.ts), use [routeRules](https://nuxt.com/docs/guide/concepts/rendering#hybrid-rendering) to
  - make the homepage statically prerendered instead of server-side rendering (to move the "load"
    to build time instead of runtime; which offloads the server)
  - disable SSR (server-side rendering) for the game page (to move the "load" to the client 🤓)

Inspect network tab in dev tools, the requests should be quicker. You can also check the folder [.nuxt/cache/nitro/functions/](./.nuxt/cache/nitro/functions/),
during dev mode it contains the cached responses.
Further, you could run a local build (see next step) and check if the file [.output/public/index.html](./.output/public/index.html)
contains our homepage marketing text.
If not, checkout branch `step4`.

## Step 5: Deploy to Production 🚀

If your repo is on GitHub, the app can be deployed for free within a few minutes using hosting provider
like Netlify or Vercel. Check out the [deployment documentation](https://nuxt.com/deploy)
for more information.

If you don't want to deploy now, checkout a deployed version at https://game-of-nodes.netlify.app/

In case you want to build and preview the application locally:

```bash
npm run build
npm run preview
```

## Further improvements

In case you want to continue playing with this, let your creativity run wild!
There are many areas that could be improved, e.g.

- improve points: give minus points if the user guessed the wrong letter and/or add a time factor
- add preloading for the next node: currently there is a slight but noticable delay when proceeding to the next node. This could be avoided by preloading the next node as soon as `isSolved` turns true. E.g. by adding a `preloadedNode` state ref in [stores/game.ts](./stores/game.ts) etc.
- add visual feedback if the user guessed the wrong letter
