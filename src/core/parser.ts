import { Lexer, Token, Tokens } from './lexer.ts';

// Node type enum
export enum Types {
  Keyword = 'Keyword',
  Node = 'Node',
  Number = 'Number',
  String = 'String',
}

// Block parameter interface
export interface Block {
  name?: string,
  type?: ExpressionTypes,
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
  params: Block,
  children: Node[],
  parent?: Node,
}

