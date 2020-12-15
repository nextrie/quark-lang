import { Lexer, Token } from './lexer.ts';

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
  raw?: string,
  children: Node[],
  parent?: Node,
}

export class Parser {
  private readonly ast: Node = {
    type: Types.Program,
    children: [],
  };
  private readonly tokens: Token[];
  constructor(content: string) {
    this.tokens = new Lexer(content).lexer();
  }
}