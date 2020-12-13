export enum Tokens {
  Node,
  String,
  Number,
}

export interface Token {
  token: Tokens,
  value: string,
}

export class Lexer {
  private readonly code: string;
  constructor(content: string) {
    this.code = content
      .split(/\r?\n/g)
      .map((line: string) => line.trim())
      .join('');
  }
  public lexer(): Token[] {
    let state: string;
    const container: Token[] = [];
    const tmp: string[] = [];

    for (const char of this.code) {
      console.log(char);
    }
    return [];
  }
}