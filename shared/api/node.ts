import type { Node } from "~/shared/types";
import type { components } from "~/shared/api/catalogApi.types";
import type { FetchError } from "ofetch";

/**
 * use type from auto-generated Hub Catalog OpenAPI types
 */
export type BasicNodeMetaInfo = components["schemas"]["BasicNodeMetaInfo"];

/**
 * Fetches details of a single node from KNIME Community Hub, including icon
 * preview and Hub URLs. Does return null for deprecated and legacy nodes.
 */
export const fetchNode = async (factoryName: string) => {
  try {
    const node = await $fetch<BasicNodeMetaInfo>(
      "https://corsproxy.io/?url=https://api.hub.knime.com/nodes/" +
        factoryName, // corsproxy just to avoid CORS issues on StackBlitz
      {
        query: {
          details: "basic",
        },
      },
    );

    // skip deprecated and legacy nodes
    if (node.deprecated || node.title.includes("(legacy)")) {
      console.log("Skipping deprecated or legacy node:", factoryName);
      return null; // null as cacheable value
    }

    // just pick the few props we need & add preview image and Hub URL
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
};
