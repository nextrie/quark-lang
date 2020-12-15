import { Lexer, Token, Tokens } from './lexer.ts';

// Node type enum
export enum Types {
  Program = 'Program',
  Keyword = 'Keyword',
  Node = 'Node',
  Number = 'Number',
  String = 'String',
}

export interface Parameter {
  name?: string,
}

// Node interface
export interface Node {
  type: Types,
  raw?: string | number,
  params: Parameter,
  children: Node[],
  parent?: Node,
}

export class Parser {
  private readonly ast: Node = {
    type: Types.Program,
    children: [],
    params: {},
  };
  private readonly tokens: Token[];
  constructor(content: string) {
    this.tokens = new Lexer(content).lexer();
  }

  private node(index: number, ast: Node): Node {
    const { value }: Token = this.tokens[index];
    if (['(', '{'].includes(String(value))) {
      ast.children.push({
        type: Types.Node,
        raw: value,
        params: {},
        children: [],
        parent: ast,
      });
    } else if ([')', '}'].includes(String(value))) {
      return this.parse(index + 1, ast.parent);
    }
    return this.parse(index + 1, ast.children.slice(-1)[0]);
  }

  private string(index: number, ast: Node): Node {
    const { value }: Token = this.tokens[index];
    ast.children.push({
      type: Types.String,
      raw: value,
      params: {},
      children: [],
      parent: ast,
    })
    return this.parse(index + 1, ast);
  }

  private number(index: number, ast: Node): Node {
    const { token, value }: Token = this.tokens[index];
    console.log(token);
    return this.parse(index + 1, ast);
  }

  private word(index: number, ast: Node): Node {
    const { token, value }: Token = this.tokens[index];
    if (!ast.params.name) ast.params.name = String(value);
    else ast.children.push({
      type: Types.Keyword,
      raw: value,
      params: {},
      children: [],
      parent: ast,
    });
    return this.parse(index + 1, ast);
  }

  public parse(index: number = 0, ast: Node = this.ast): Node {
    if (this.tokens.length === index) return ast;
    const { token, value }: Token = this.tokens[index];
    switch(token) {
      case Tokens.Node:
        return this.node(index, ast);
      case Tokens.String:
        return this.string(index, ast);
      case Tokens.Number:
        return this.number(index, ast);
      case Tokens.Word:
        return this.word(index, ast);
    }
    return this.parse(index + 1, ast);
  }
}