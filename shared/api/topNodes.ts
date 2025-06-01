type TopNodes = {
  /** actually it's the factoryName, not the Hub id */
  nodeId: string;
  rank: number;
}[];

/**
 * Fetches a list of top used nodes.
 * Just imagine we'd call e.g. a KNIME workflow deployed as REST service, basically
 * a rather expensive and potentially slow call to get the top nodes.
 * For this exercise, we just use a static list of nodes with artificial delay.
 */
export const fetchTopNodes = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
  const topNodes: TopNodes = (await import("./topNodesFallback.json"))
    .default as TopNodes;
  return topNodes;

  // just for reference: an example of fetching from service deployed on KNIME Hub
  /*
    const { knimeServiceUser, knimeServicePassword } = useRuntimeConfig(event);
    try {
      const topNodes = await $fetch(
        "https://api.hub.knime.com/deployments/rest:1255437a-2b46-4d70-98df-6e5360c6d34d/raw-execution",
        {
          query: {
            timeout: 50000,
            reset: true,
            keepJob: false,
          },
          headers: {
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
};
