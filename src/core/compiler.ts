/*//////////////////////////////////////
               Quark lang
                Compiler
//////////////////////////////////////*/

import { Stack } from 'interfaces/stack';
import { Token } from 'interfaces/token';
import { VM } from 'interfaces/vm';
import bytecode from 'vm/bytecode';
import Tokenizer from 'core/tokenizer';
import tokens from './tokens/tokens';

export default class Compiler {
  private readonly content: Array<string>;

  private tokens: Array<Array<Token>> = [];

  private bytecode: Array<Array<string>> = [];

  private lastBytecode: string = Object.values(bytecode).slice(-1)[0];

  private lastToken: Token;

  private tmp: any;

  private stack: Stack = {
    symbols: {},
    values: {},
  };

  private state: Array<string> = [];

  constructor(content: string) {
    Tokenizer.addTokenSet(tokens);

    this.content = content
      .split(/\r?\n/g)
      .join('')
      .split(/;/g)
      .filter((x) => x.length > 0);
    this.content.map((line: string) => {
      this.tokens.push(Tokenizer.tokenize(line));
      return true;
    });
  }

  public getCompiledCode(): VM {
    return {
      stack: this.stack,
      bytecode: this.bytecode.filter((x) => x.length > 0),
      lastBytecode: this.lastBytecode,
    };
  }

  public printCompiledCode(): void {
    const styledBytecode: string = this.bytecode
      .filter((x) => x.length > 0)
      .map((x) => x.join(' '))
      .join('\n');
    const styledSymbols: string = Object
      .entries(this.stack.symbols)
      .map((x) => `${x[0]}\n  ${x[1].join(' ')}`)
      .join('\n');
    if (styledBytecode && styledSymbols) process.stdout.write(`\n${styledSymbols}\n\n${styledBytecode}\n\n`);
    else process.stdout.write('NONE\n');
  }
}