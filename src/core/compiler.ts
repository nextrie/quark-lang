/*//////////////////////////////////////
               Quark lang
                Compiler
//////////////////////////////////////*/

import { Stack } from 'interfaces/stack';
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

  private state: Array<string> = [];

  constructor(content: string) {
    Tokenizer.addTokenSet(tokens);

    this.content = content.split(/\r?\n/g);
    this.content.map((line: string) => {
      this.tokens.push(Tokenizer.tokenize(line));
      return true;
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private arrayContainsArray(array1: Array<any>, array2: Array<any>) {
    for (let i = 0; i < array1.length; i += 1) {
      if (array1[i] !== array2[i]) return false;
    }
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  private stringToBytecode(text: string): Array<string> {
    return text
      .slice(1, text.length - 1)
      .split('')
      .map((x) => x.charCodeAt(0))
      .map((x) => x.toString(16))
      .map((x) => `0x${x}`);
  }

  // eslint-disable-next-line class-methods-use-this
  private numberToBytecode(number: number | string): Array<string> {
    return [`0x${Number(number).toString(16)}`];
  }

  private getBytecodeIdentifier(): string | null {
    let symbolsIdentifier: number;
    let valuesIdentifier: number;
    const symbols: Array<string> = Object.keys(this.stack.symbols);
    const values: Array<string> = Object.keys(this.stack.values);
    if (symbols.length > 0) {
      symbolsIdentifier = Number(symbols.slice(-1)[0]) + 1;
    } else if (values.length > 0) {
      valuesIdentifier = Number(values.slice(-1)[0]) + 1;
    } else {
      return `0x0${(Number(Object.values(bytecode).slice(-1)[0]) + 1).toString(16)}`;
    }

    if (!symbolsIdentifier || Number.isNaN(symbolsIdentifier)) {
      if (Number.isNaN(symbolsIdentifier)) return `0x${valuesIdentifier}`;
      return `0x${valuesIdentifier < 10 ? `0${valuesIdentifier}` : valuesIdentifier}`;
    }
    if (!valuesIdentifier || Number.isNaN(valuesIdentifier)) {
      if (Number.isNaN(valuesIdentifier)) return `0x${symbolsIdentifier}`;
      return `0x${symbolsIdentifier < 10 ? `0${symbolsIdentifier}` : symbolsIdentifier}`;
    }
    if (symbolsIdentifier && valuesIdentifier) {
      return symbolsIdentifier > valuesIdentifier
        ? `0x${symbolsIdentifier < 10 ? `0${symbolsIdentifier}` : symbolsIdentifier}`
        : `0x${valuesIdentifier < 10 ? `0${valuesIdentifier}` : valuesIdentifier}`;
    }
    return null;
  }

  private isValueExists(word: string): boolean {
    if (Object
      .values(this.stack.values)
      .filter((x) => x.name === word)
      .length > 0
    ) return true;
    return false;
  }

  private getValueBytecode(word: string): string | null {
    const results: Array<string> | null = Object
      .entries(this.stack.values)
      .filter((x) => x[1].name === word)
      .map((x) => x[0]);
    if (results && results.length > 0) return results[0];
    return null;
  }

  public compile(): VM {
    this.tokens.map((line) => {
      this.bytecode.push([]);
      this.state = [];
      line.map((item) => {
        const {
          token,
          value,
        }: Token = item;
        if (!token) return true;
        if (bytecode[token]) this.bytecode.slice(-1)[0].push(bytecode[token]);
        else {
          switch (token) {
            case 'STRING': {
              const identifier: string = this.getBytecodeIdentifier();
              this.stack.symbols[identifier] = this.stringToBytecode(value);
              this.bytecode.slice(-1)[0].push(identifier);
              break;
            }
            case 'NUMBER': {
              const identifier: string = this.getBytecodeIdentifier();
              this.stack.symbols[identifier] = this.numberToBytecode(value);
              this.bytecode.slice(-1)[0].push(identifier);
              break;
            }
            case 'WORD': {
              if (this.isValueExists(value)) {
                this.bytecode.slice(-1)[0].push(this.getValueBytecode(value));
              } else {
                const identifier: string = this.getBytecodeIdentifier();
                this.stack.values[identifier] = {
                  name: value,
                };
                this.bytecode.slice(-1)[0].push(identifier);
              }
              break;
            }
            default: {
              break;
            }
          }
        }
        return true;
      });
      return true;
    });
    return {
      stack: this.stack,
      bytecode: this.bytecode.filter((x) => x.length > 0),
    };
  }

  public getCompiledCode(): string | null {
    const styledBytecode: string = this.bytecode
      .filter((x) => x.length > 0)
      .map((x) => x.join(' '))
      .join('\n');
    const styledSymbols: string = Object
      .entries(this.stack.symbols)
      .map((x) => `${x[0]}\n  ${x[1].join(' ')}`)
      .join('\n');
    if (styledBytecode && styledSymbols) return `\n${styledSymbols}\n\n${styledBytecode}\n`;
    return null;
  }
}