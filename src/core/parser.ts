import { Lexer, Token, Tokens } from './lexer.ts';

// Node interface
interface AST {
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

interface String extends AST {
  type: 'String',
  parent?: Node,
  value: string,
}

interface Identifier extends AST {
  type: 'Identifier',
  parent?: Node,
  value: string,
}

export type Node = VariableDeclaration | Body | String | Identifier;

class PreParser {
  // AST default variable
  private static ast: Node;
  private static tokens: Token[];

  private static node(index: number, ast: Body): Node {
    const { value }: Token = this.tokens[index];
    // Checking if node start or end
    if (!this.ast) {
      this.ast = {
        type: 'Body',
        body: [],
      }
      return this.any(index + 1, ast);
    }
    if (['(', '{'].includes(value)) {
      // Pushing new node
      ast.body.push({
        type: 'Body',
        body: [],
        parent: ast,
      });
    } else if ([')', '}'].includes(value)) {
      // Returning parent node
      return this.any(index + 1, ast.parent);
    }
    return this.any(index + 1, ast.body.slice(-1)[0]);
  }

  private static string(index: number, ast: Body): Node {
    const { value }: Token = this.tokens[index];
    // Pushing string to ast children
    ast.body.push({
      type: 'String',
      value,
      parent: ast,
    });
    return this.any(index + 1, ast);
  }

  private static word(index: number, ast: Node): Node {
    const { value }: Token = this.tokens[index];
    // Checking if block
    if (value === 'let') {
      ast.type = 'VariableDeclaration';
    } else {
      (<Body>ast).body.push({
        type: 'Identifier',
        value: value,
        parent: ast,
      });
    }
    return this.any(index + 1, ast);
  }

  private static any(index: number = 0, ast: Node = this.ast as Node): Node {
    // Checking if iterating ends and returning ast
    if (this.tokens.length === index) return ast;
    const { token }: Token = this.tokens[index];
    // Parsing based on token type
    switch(token) {
      case Tokens.Node:
        return this.node(index, ast as Body);
      case Tokens.String:
        return this.string(index, ast as Body);
      case Tokens.Word:
        return this.word(index, ast);
    }
    return this.any(index + 1, ast);
  }

  public static parse(source: string): Node {
    this.tokens = new Lexer(source).lexer();
    return this.any(0, this.ast as Node);
  }
}

export class Parser {
  private static ast: Node;

  public static parse(source: string) {
    this.ast = PreParser.parse(source);
    console.log(this.ast);
  }
}