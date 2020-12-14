// Tokens list
export enum Tokens {
  Node = 'Node',
  String = 'String',
  Word = 'Word',
  Number = 'Number',
}

// Token interface
export interface Token {
  token: Tokens,
  value: string,
}

export class Lexer {
  private readonly code: string;
  constructor(content: string) {
    // Formatting content and setting it to code variable
    this.code = content
      .split(/\r?\n/g)
      .map((line: string) => line.trim())
      .join('');
  }
  public lexer(): Token[] {
    // State variable contains state of temporary value
    let state: string = '';
    // Container variable contains processed tokens
    const container: Token[] = [];
    // Tmp variable contains temporary code chars
    const tmp: string[] = [];

    for (const char of this.code) {
      // Checking if char is node
      if (['(', ')', '{', '}'].includes(char)) {
        // Checking if tmp isn't empty and adding it to tokens
        if (tmp.length > 0) {
          state = '';
          container.push({ token: Tokens.Word, value: tmp.join('').trim() });
          tmp.splice(0, tmp.length);
        }
        // Pushing node token to tokens
        container.push({ token: Tokens.Node, value: char, });
      } else if (char === '"') {
        // Pushing quote char to tmp
        tmp.push(char);
        // Checking if it's string end and pushing it to tokens
        if (state === 'STRING') {
          state = '';
          container.push({ token: Tokens.String, value: tmp.join('').trim() });
          tmp.splice(0, tmp.length);
        } else {
          // Setting state to string
          state = 'STRING';
        }
      } else if (char === ' ' && tmp.length > 0) {
        // Checking if it's space in string
        if (state === 'STRING') {
          tmp.push(char);
        } else {
          // Resetting state and pushing word to tokens
          state = '';
          container.push({ token: Tokens.Word, value: tmp.join('').trim() });
          tmp.splice(0, tmp.length);
        }
      } else {
        // Pushing any char to temporary variable
        tmp.push(char);
      }
    }
    // Returning tokens list
    return container.map((token: Token) => {
      if ([Tokens.Word, Tokens.String].includes(token.token) && !isNaN(Number(token.value))) {
        token.token = Tokens.Number;
      }
      return token;
    });
  }
}