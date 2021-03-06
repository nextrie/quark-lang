import { Lexer, Token, Tokens } from './lexer.ts';

type Node = Array<string | Node>

export class Parser {
  private static tokens: Token[];
  private static ast: Node = [];
  private static parents: number[] = [];

  private static goTo(it: number = this.parents.length, ast: Node = this.ast): Node {
    if (it === 0) return ast;
    this.parents.splice(0, 1);
    return this.goTo(it - 1, ast[it - 1] as Node);
  }

  public static parse(source: string) {
    this.tokens = new Lexer(source).lexer();
    const Parse = (index: number = 0, ast: Node = this.ast): Node => {
      const token: Token = this.tokens[index];
      if (!token) return this.ast;
      if (token.token === Tokens.Node) {
        if (['(', '{'].includes(token.value)) {
          this.parents.push(ast.length + 1);
          ast.push([] as Node);
          return Parse(index + 1, ast.slice(-1)[0] as Node)
        } else {
          return Parse(index + 1, this.goTo(1));
        }
      } else if ([Tokens.String, Tokens.Word].includes(token.token)) {
        ast.push(token.value);
      }
      return Parse(index + 1, ast);
    }
    return Parse();
  }
}