import { Stack } from 'interfaces/stack';
/*//////////////////////////////////////
               Quark lang
                Compiler
//////////////////////////////////////*/

import { Token } from 'interfaces/token';
import { VM } from 'interfaces/vm';
import bytecode from 'vm/bytecode';
import Tokenizer from './parser';
import tokens from './tokens/tokens';

export default class Compiler {
  private readonly content: Array<string>;

  private tokens: Array<Array<Token>> = [];

  private bytecode: Array<Array<string>> = [];

  private stack: Stack = {
    symbols: {

    },
    values: {

    },
  };

  constructor(content: string) {
    Tokenizer.addTokenSet(tokens);

    this.content = content.split(/\r?\n/g);
    this.content.map((line: string) => {
      this.tokens.push(Tokenizer.tokenize(line));
      return true;
    });
  }

  public compile(): VM {
    this.tokens.map((line) => {
      this.bytecode.push([]);
      line.map((item) => {
        const {
          token,
          value,
        }: Token = item;
        if (bytecode[token]) {
          this.bytecode.slice(-1)[0].push(bytecode[token]);
        } else if (token === 'STRING') {
          const stringSymbolIdentifier: number = Number(Object.values(bytecode).slice(-1)[0]) + 1;
          let stringSymbolBytecode: string;
          if (stringSymbolIdentifier < 10) stringSymbolBytecode = `0x0${stringSymbolIdentifier}`;
          else stringSymbolBytecode = `0x${stringSymbolIdentifier}`;
          this.stack.symbols[stringSymbolBytecode] = value
            .slice(1, value.length - 1)
            .split('')
            .map((x) => x.charCodeAt(0))
            .map((x) => x.toString(16))
            .map((x) => `0x${x}`);
          this.bytecode.slice(-1)[0].push(stringSymbolBytecode);
        }
        return true;
      });
      return true;
    });
    return {
      stack: this.stack,
      bytecode: this.bytecode,
    };
  }
}