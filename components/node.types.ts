type Node = {
  featureSymbolicName: string;
  keywords: string[];
  icon: {
    streamable: boolean;
    hasDynInPorts: boolean;
    hasDynOutPorts: boolean;
    inPorts: {
      objectClass: string;
      optional: boolean;
      dataType: string;
      color: string;
      description: string;
      name: string;
    }[];
    outPorts: {
      objectClass: string;
      optional: boolean;
      dataType: string;
      color: string;
      description: string;
      name: string;
    }[];
    data: string;
    deprecated: boolean;
    type: string;
  };
  tags: string[];
  private: boolean;
  pathToResource: string;
  ownerAccountId: string;
  kudosCount: number;
  itemType: string;
  id: string;
  description: string;
  title: string;
  owner: string;
};

type NodeList = Node[];

export type { Node, NodeList };
