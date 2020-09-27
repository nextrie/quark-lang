/*//////////////////////////////////////
               Quark lang
                 Parser
//////////////////////////////////////*/

import Tokenizer from 'core/tokenizer';
import { Token } from 'interfaces/token';
import Tokens from 'tokens'
export default class Parser {
  private code: Array<string>;
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

  public parse() {
    this.tokens.map((tokens: Array<Token>): boolean => {
      tokens.map((item: Token): boolean => {
        const {
          token,
          value
        }: Token = item;
        console.log(token);
        return true;
      });
      return true;
    });
  }
}