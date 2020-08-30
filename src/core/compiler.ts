/*//////////////////////////////////////
               Quark lang
                Compiler
//////////////////////////////////////*/

import { Token } from 'interfaces/token';
import Tokenizer from './parser';
import tokens from './tokens/tokens';

export default class Compiler {
  private readonly content: string;

  private tokens: Array<Token>;

  constructor(content: string) {
    this.content = content;
    Tokenizer.addTokenSet(tokens);
    this.tokens = Tokenizer.tokenize(this.content);
  }

  public compile(): Array<Array<string>> {
    console.log(this.tokens);
    return [['']];
  }
}