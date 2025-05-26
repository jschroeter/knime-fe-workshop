const fetchTopNodes = defineCachedFunction(
  async (event) => {
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
              `${knimeServiceUser}:${knimeServicePassword}`
            )}`,
          },
          timeout: 60000,
          retry: 0,
        }
      );
      return topNodes;
    } catch (error) {
      console.error("Failed to fetch top nodes:", error.data);
      return createError({
        statusCode: 500,
        statusMessage: "Failed to fetch top nodes",
      });
    }
  },
  {
    maxAge: 60 * 60 * 1000, // Cache for 1 hour
  }
);

const fetchNode = defineCachedFunction(
  async (nodeId) => {
    try {
      const node: object = await $fetch(
        "https://api.hubdev.knime.com/nodes/" + nodeId,
        {
          query: {
            details: "full",
          },
        }
      );

      // add preview image URL to the node object
      const nodeWithPreview = {
        title: node.title,
        type: node.nodeType,
        preview: "https://hub.knime.com/site/png-icon/Node/" + node.id,
        url: "https://hub.knime.com/n/" + node.id.replace("*", ""),
      };

      return nodeWithPreview;
    } catch (error) {
      console.error("Failed to fetch node: ", error.data);
    }
  },
  {
    maxAge: 60 * 60 * 1000, // Cache for 1 hour
  }
);

export default defineEventHandler(async (event) => {
  //const topNodes = await fetchTopNodes(event);

  const topNodes = [
    {
      nodeId: "org.knime.base.node.preproc.groupby.GroupByNodeFactory#GroupBy",
    },
    {
      nodeId:
        "org.knime.base.node.rules.engine.RuleEngineNodeFactory#Rule Engine",
    },
    {
      nodeId:
        "org.knime.base.node.flowvariable.tablerowtovariable3.TableToVariable3NodeFactory#Table Row to Variable",
    },
    {
      nodeId:
        "org.knime.base.node.preproc.stringmanipulation.multicolumn.MultiColumnStringManipulationNodeFactory#String Manipulation (Multi Column)",
    },
  ];

  const randomIndex = Math.floor(Math.random() * topNodes.length);
  const randomNode = topNodes[randomIndex];
  const result = await fetchNode(randomNode.nodeId);

  return (
    result ||
    createError({
      statusCode: 500,
      statusMessage: "Failed to fetch node details",
    })
  );
});
