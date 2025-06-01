import type { BasicNodeMetaInfo } from "~/shared/api/node";

export type Node = Pick<BasicNodeMetaInfo, "title" | "nodeType" | "id"> & {
  /** Absolute image URL to a preview of the node */
  preview: string;
  /** Absolute URL to the node page on KNIME Community Hub */
  url: string;
};
