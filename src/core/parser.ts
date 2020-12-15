// Node type enum
export enum Types {
  Keyword = 'Keyword',
  Node = 'Node',
  Number = 'Number',
  String = 'String',
}

// Node interface
export interface Node {
  type: Types,
  raw: string,
  children: Node[],
  parent?: Node,
}