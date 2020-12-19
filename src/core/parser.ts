import { Lexer, Token, Tokens } from './lexer.ts';

// Node type enum
export enum Types {
  Program = 'Program',
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

export class Parser {
  // AST default variable
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
    // Checking if node start or end
    if (['(', '{'].includes(value)) {
      // Pushing new node
      ast.children.push({
        type: Types.Node,
        raw: value,
        params: {},
        children: [],
        parent: ast,
      });
    } else if ([')', '}'].includes(value)) {
      // Returning parent node
      return this.parse(index + 1, ast.parent);
    }
    return this.parse(index + 1, ast.children.slice(-1)[0]);
  }

  private string(index: number, ast: Node): Node {
    const { value }: Token = this.tokens[index];
    // Pushing string to ast children
    ast.children.push({
      type: Types.String,
      raw: value,
      params: {},
      children: [],
      parent: ast,
    });
    return this.parse(index + 1, ast);
  }

  private word(index: number, ast: Node): Node {
    const { value }: Token = this.tokens[index];
    // Checking if block
    if (!ast.params.name) {
      // Updating ast parameter type
      switch (value.toString()) {
        case '+': case '*': case '-': case '/':
          ast.params.type = ExpressionTypes.OperandCall;
          break;
        case 'let':
          ast.params.type = ExpressionTypes.VariableDefinition;
          break;
        default:
          ast.params.type = ExpressionTypes.FunctionCall;
      }
      ast.params.name = value;
    } else {
      ast.children.push({
        // Checking if value is number or not
        type: isNaN(Number(value)) ? Types.Keyword : Types.Number,
        raw: value,
        params: {},
        children: [],
        parent: ast,
      });
    }
    return this.parse(index + 1, ast);
  }

  public parse(index: number = 0, ast: Node = this.ast): Node {
    // Checking if iterating ends and returning ast
    if (this.tokens.length === index) return ast;
    const { token }: Token = this.tokens[index];
    // Parsing based on token type
    switch(token) {
      case Tokens.Node:
        return this.node(index, ast);
      case Tokens.String:
        return this.string(index, ast);
      case Tokens.Word:
        return this.word(index, ast);
    }
    return this.parse(index + 1, ast);
  }
}