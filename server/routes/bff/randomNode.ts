import type { MinimumNodeMetaInfo, TopNodes } from "~/server/types";
import type { Node } from "~/shared/types";
import type { FetchError } from "ofetch";

const fetchTopNodes = defineCachedFunction(
  async (/* event */) => {
    // Just imagine we'd call e.g. a KNIME workflow deployed as REST service, basically a rather expensive call
    // to get the top nodes, which we don't want to do all the time. So we add some caching.
    // But for this exercise, we just return a static list of nodes.
    const topNodes: TopNodes = (await import("./fallbackTopNodes.json"))
      .default as TopNodes;
    return topNodes;

    /*
    const { knimeServiceUser, knimeServicePassword } = useRuntimeConfig(event);
    try {
      const topNodes = await $fetch(
        "https://api.hubdev.knime.com/deployments/rest:1255437a-2b46-4d70-98df-6e5360c6d34d/raw-execution",
        {
          query: {
            timeout: 50000,
            reset: true,
            keepJob: false,
          },
          headers: {
            Host: "api.hubdev.knime.com",
            Authorization: `Basic ${btoa(
              `${knimeServiceUser}:${knimeServicePassword}`,
            )}`,
          },
          timeout: 60000,
          retry: 0,
        },
      );
      return topNodes;
    } catch (error) {
      console.error("Failed to fetch top nodes:", (error as FetchError).data);
      return createError({
        statusCode: 500,
        statusMessage: "Failed to fetch top nodes",
      });
    }
    */
  },
  {
    maxAge: 60 * 60 * 1000, // Cache for 1 hour
    staleMaxAge: -1, // Allow stale data; re-fetch in background
    getKey: () => "topNodes",
  },
);

/**
 * Fetches details of a single node from KNIME Community Hub.
 */
const fetchNode = defineCachedFunction(
  async (factoryName: Pick<MinimumNodeMetaInfo, "factoryName">) => {
    try {
      const node = await $fetch<MinimumNodeMetaInfo>(
        "https://api.hubdev.knime.com/nodes/" + factoryName,
        {
          query: {
            details: "minimum",
          },
        },
      );

      // add preview image URL to the node object
      const nodeWithPreview: Node = {
        id: node.id,
        title: node.title,
        nodeType: node.nodeType,
        preview: "https://hub.knime.com/site/png-icon/Node/" + node.id,
        url: "https://hub.knime.com/n/" + node.id.replace("*", ""),
      };

      return nodeWithPreview;
    } catch (error) {
      console.error("Failed to fetch node: ", (error as FetchError).data);
    }
  },
  {
    maxAge: 60 * 60 * 1000, // Cache for 1 hour
    staleMaxAge: -1, // Allow stale data; re-fetch in background
    getKey: (factoryName: Pick<MinimumNodeMetaInfo, "factoryName">) =>
      `node:${factoryName}`,
  },
);

export default defineEventHandler(async (event): Promise<Node> => {
  const topNodes = await fetchTopNodes(event);

  // pick a random node from the top nodes
  const randomIndex = Math.floor(Math.random() * topNodes.length);
  const randomNode = topNodes[randomIndex];
  const result = await fetchNode(randomNode.nodeId);

  if (!result) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch random node",
    });
  }

  return result;
});
