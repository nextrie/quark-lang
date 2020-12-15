import { Lexer, Token, Tokens } from './lexer.ts';

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

  private node(index: number, ast: Node): Node {
    const token: Token = this.tokens[index];
    console.log(token);
    return this.any(index + 1, ast);
  }

  private string(index: number, ast: Node): Node {
    const token: Token = this.tokens[index];
    console.log(token);
    return this.any(index + 1, ast);
  }

  private number(index: number, ast: Node): Node {
    const token: Token = this.tokens[index];
    console.log(token);
    return this.any(index + 1, ast);
  }

  private word(index: number, ast: Node): Node {
    const token: Token = this.tokens[index];
    console.log(token);
    return this.any(index + 1, ast);
  }

  private any(index: number = 0, ast: Node = this.ast): Node {
    if (this.tokens.length === index) return ast;
    const { token, value }: Token = this.tokens[index];
    switch(token) {
      case Tokens.Node:
        return this.word(index, ast);
      case Tokens.String:
        return this.string(index, ast);
      case Tokens.Number:
        return this.number(index, ast);
      case Tokens.Word:
        return this.word(index, ast);
    }
    return this.any(index + 1, ast);
  }

  public parse() {
    this.any();
  }
}