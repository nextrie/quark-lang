import { Lexer, Token, Tokens } from './lexer.ts';

// Node interface
export interface AST {
  type: string,
  children?: Node[],
  parent?: Node,
}

interface VariableDeclaration extends AST {
  type: 'VariableDeclaration',
  identifier: string,
  value: string,
  parent: Node,
}

interface Body extends AST {
  type: 'Body',
  body: Node[],
  parent?: Node,
}

export type Node = VariableDeclaration | Body;

export class Parser {
  private static ast: Node = { type: 'Body', body: [] };
  private static tokens: Token[];

  public static parse(source: string | Token[]): Node {
    this.tokens = typeof source === 'string'
      ? new Lexer(source).lexer()
      : source;
    return this.ast;
  }
}