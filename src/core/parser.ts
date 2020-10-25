/*//////////////////////////////////////
               Quark lang
                 Parser
//////////////////////////////////////*/

import Tokenizer from 'core/tokenizer';
import { Token } from 'interfaces/token';
import Tokens from 'tokens';
import { Node } from 'interfaces/node';

export default class Parser {
  private code: Array<string>;

  private ast: Node = {
    type: 'Program',
    raw: '',
    children: [],
  };

  private tokens: Array<Array<Token>> = [];

  constructor(code: string) {
    this.code = code
      .split(/\r?\n/g)
      .join('')
      .split(/;/g)
      .filter((x) => x.length > 0);
    Tokenizer.addTokenSet(Tokens);
    this.code.map((line: string): boolean => {
      this.tokens.push(Tokenizer.tokenize(line));
      return true;
    });
  }

  // eslint-disable-next-line class-methods-use-this
  public parse(token: Token, nextTokens: Array<Token>, prevTokens: Array<Token>) {
    if (Parser.prototype[token.token.toLowerCase()]) {
      this.ast = Parser.prototype[token.token.toLowerCase()](token, nextTokens, prevTokens);
      return this.ast;
    }
    return null;
  }

  public init() {
    this.tokens.map((tokens: Array<Token>): boolean => {
      tokens.map((item: Token, index: number): boolean => {
        const {
          token,
        }: Token = item;
        if (!token) return true;
        this.parse(item, tokens.slice(index + 1), tokens.slice(0, index));
        return true;
      });
      return true;
    });
    console.log(this.ast);
  }
}