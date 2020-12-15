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

  private any(tokens: Token[], index: number = 0, ast: Node = this.ast): Node {
    if (tokens.length === index) return ast;
    const token: Token = tokens[index];
    console.log(token);
    return this.any(tokens, index + 1, ast);
  }
  public parse() {
    this.any(this.tokens);
  }
}