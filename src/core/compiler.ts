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

  private getBytecodeIdentifier(): string {
    let byte: string = (parseInt(this.lastBytecode, 16) + 1).toString(16);
    if (byte.length === 2) byte = `0x${byte}`;
    else byte = `0x0${byte}`;
    this.lastBytecode = byte;
    return byte;
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
      this.tmp = {};
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
              this.stack.symbols[identifier] = {
                value: this.stringToBytecode(value),
                type: 'string',
              };
              if (this.state.includes('ARRAY::DECLARATION')) {
                this.stack.values[this.tmp.bytecodeArray].bound.push(identifier);
              } else this.bytecode.slice(-1)[0].push(identifier);
              break;
            }
            case 'NUMBER': {
              const identifier: string = this.getBytecodeIdentifier();
              this.stack.symbols[identifier] = {
                value: this.numberToBytecode(value),
                type: 'number',
              };
              if (this.state.includes('ARRAY::DECLARATION')) {
                this.stack.values[this.tmp.bytecodeArray].bound.push(identifier);
              } else this.bytecode.slice(-1)[0].push(identifier);
              break;
            }
            case 'WORD': {
              if (this.isValueExists(value)) {
                this.bytecode.slice(-1)[0].push(this.getValueBytecode(value));
              } else {
                const identifier: string = this.getBytecodeIdentifier();
                this.tmp.variableName = identifier;
                this.stack.values[identifier] = {
                  name: value,
                  bound: [],
                };
                if (this.state.includes('ARRAY::DECLARATION')) {
                  this.stack.values[this.tmp.bytecodeArray].bound.push(identifier);
                } else this.bytecode.slice(-1)[0].push(identifier);
              }
              break;
            }
            case 'BRACKET_OP': {
              if (this.lastToken.token !== 'WORD') {
                this.state.push('ARRAY::DECLARATION');
                const identifier: string = this.getBytecodeIdentifier();
                this.tmp.bytecodeArray = identifier;
                this.stack.values[this.tmp.variableName].bound.push(identifier);
                this.stack.values[identifier] = {
                  type: 'array',
                  bound: [],
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
        this.lastToken = item;
        return true;
      });
      return true;
    });
    return this.getCompiledCode();
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