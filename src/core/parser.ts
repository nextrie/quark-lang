// Node type enum
export enum Types {
  Program = 'Program',
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