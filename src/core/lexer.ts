export enum Tokens {
  Node = 'Node',
  String = 'String',
  Word = 'Word',
  Number = 'Number',
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
    let state: string = '';
    const container: Token[] = [];
    const tmp: string[] = [];

    for (const char of this.code) {
      if (['(', ')', '{', '}'].includes(char)) {
        if (tmp.length > 0) {
          state = '';
          container.push({ token: Tokens.Word, value: tmp.join('') });
          tmp.splice(0, tmp.length);
        }
        container.push({ token: Tokens.Node, value: char, });
      } else if (char === '"') {
        tmp.push(char);
        if (state === 'STRING') {
          state = '';
          container.push({ token: Tokens.String, value: tmp.join('') });
          tmp.splice(0, tmp.length);
        } else {
          state = 'STRING';
        }
      } else if (char === ' ' && tmp.length > 0) {
        if (state === 'STRING') {
          tmp.push(char);
        } else {
          state = '';
          container.push({ token: Tokens.Word, value: tmp.join('').trim() });
          tmp.splice(0, tmp.length);
        }
      } else {
        tmp.push(char);
      }
    }
    return container;
  }
}