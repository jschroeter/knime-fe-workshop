export type TopNodes = {
  nodeId: Pick<MinimumNodeMetaInfo, "factoryName">;
  rank: number;
}[];

/**
 * auto-generated types from Hub Catalog OpenAPI spec
 */

/** @description Minimal information about a node. */
export type MinimumNodeMetaInfo = {
  /**
   * @description name of the node
   * @example Decision Tree Learner
   */
  title: string;
  /**
   * @example Learner
   * @enum {string}
   */
  nodeType:
    | "Source"
    | "Sink"
    | "Learner"
    | "Predictor"
    | "Manipulator"
    | "Visualizer"
    | "Meta"
    | "LoopStart"
    | "LoopEnd"
    | "ScopeStart"
    | "ScopeEnd"
    | "QuickForm"
    | "Other"
    | "Missing"
    | "Unknown"
    | "Subnode"
    | "VirtualIn"
    | "VirtualOut";
  /**
   * @description The node's unique ID.
   * @example *YK_q3iKGm3WUlAzo
   */
  id: string;
  /**
   * @description The node's factory class name. If the node is dynamic a colon plus a hash of the factory settings is appended
   * @example org.knime.ext.poi3.node.io.filehandling.excel.reader.ExcelTableReaderNodeFactory
   */
  factoryName?: string;
  /**
   * @description The node's factory class id, which is the node's factory class name for non dynamic nodes. If the node is dynamic a hash plus an unique id is appended. The unique id might be the node's title for dynamic nodes that were release before Analytics Platform version 5.1.
   * @example org.knime.ext.poi3.node.io.filehandling.excel.reader.ExcelTableReaderNodeFactory
   */
  factoryId?: string;
  /** @example [
   *       "Analytics",
   *       "Mining",
   *       "Decision Tree"
   *     ] */
  path: string[];
};
