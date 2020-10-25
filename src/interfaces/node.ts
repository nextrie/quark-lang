export interface Node {
  type: string,
  raw: string,
  children: Node[],
  parent?: Node,
}