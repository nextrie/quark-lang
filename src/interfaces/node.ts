import { Types } from 'interfaces/types';

export interface Node {
  type: Types,
  raw: string,
  children: Node[],
  parent?: Node,
}