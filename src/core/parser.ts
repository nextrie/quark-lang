import { Lexer, Token, Tokens } from './lexer.ts';

// Node type enum
export enum Types {
  Keyword = 'Keyword',
  Node = 'Node',
  Number = 'Number',
  String = 'String',
}

// Expressions enum added.
export enum ExpressionTypes {
  FunctionCall = 'FunctionCall',
  OperandCall = 'OperandCall',
  VariableDefinition = 'VariableDefinition',
}

// Node interface
export interface Node {
  type: Types,
  raw?: string,
  children: Node[],
  parent?: Node,
}

export class Parser {
  private static ast: Node = { type: Types.Node, children: [] };
  private static tokens: Token[];

  public static parse(source: string | Token[]): Node {
    this.tokens = typeof source === 'string'
      ? new Lexer(source).lexer()
      : source;
    return this.ast;
  }
}