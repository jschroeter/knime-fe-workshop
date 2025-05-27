import type { MinimumNodeMetaInfo } from "~/server/types";

export type Node = Pick<MinimumNodeMetaInfo, "title" | "nodeType" | "id"> & {
  /** Absolute image URL to a preview of the node */
  preview: string;
  /** Absolute URL to the node page on KNIME Community Hub */
  url: string;
};
