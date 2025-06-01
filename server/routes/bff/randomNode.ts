import type { Node } from "~/shared/types";
import { fetchTopNodes } from "~/shared/api/topNodes";
import { fetchNode } from "~/shared/api/node";

// TODO wrap fetchTopNodes and fetchNode in defineCachedFunctions

export default defineEventHandler(async (event) => {
  const topNodes = await fetchTopNodes();

  // get "level" from query params, default to 10 if not provided or invalid
  const levelParam = getQuery(event).level;
  let level = Number(levelParam);
  if (isNaN(level) || level < 1 || level > 10) level = 10;

  // determine the range of nodes to pick from based on level
  // level 1 means first 10% of top nodes, level 10 means 100%
  const range = Math.max(1, Math.ceil((topNodes.length * level) / 10));
  let node: Node | undefined | null;
  let attempts = 0;

  // pick a random node, but there might be nodes that are not available
  // or deprecated, therefore let's try a few times until we find a valid one
  while (!node && attempts < 5) {
    const randomIndex = Math.floor(Math.random() * range);
    const randomNodeId = topNodes[randomIndex].nodeId;
    node = await fetchNode(randomNodeId);
    attempts++;
  }

  if (!node) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch random node",
    });
  }

  return node;
});
