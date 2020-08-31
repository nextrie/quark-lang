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

  private findIdentifier(): string {
    let stringSymbolIdentifier: number;

    let symbolsSymbolIdentifier: number;
    let valueSymbolIdentifier: number;

    if (Object.values(this.stack.symbols).length > 0
        || Object.values(this.stack.values).length > 0) {
      symbolsSymbolIdentifier = Number(Object.keys(this.stack.symbols).slice(-1)[0]) + 1;
      valueSymbolIdentifier = Number(Object.keys(this.stack.values).slice(-1)[0]) + 1;
      if (Number.isNaN(symbolsSymbolIdentifier)) stringSymbolIdentifier = valueSymbolIdentifier;
      // eslint-disable-next-line max-len
      else if (Number.isNaN(valueSymbolIdentifier)) stringSymbolIdentifier = symbolsSymbolIdentifier;
      if (!stringSymbolIdentifier) {
        stringSymbolIdentifier = symbolsSymbolIdentifier > valueSymbolIdentifier
          ? symbolsSymbolIdentifier
          : valueSymbolIdentifier;
      }
    } else stringSymbolIdentifier = Number(Object.values(bytecode).slice(-1)[0]) + 1;
    let stringSymbolBytecode: string;
    if (stringSymbolIdentifier < 10) stringSymbolBytecode = `0x0${stringSymbolIdentifier}`;
    else stringSymbolBytecode = `0x${stringSymbolIdentifier}`;
    return stringSymbolBytecode;
  }

  public compile(): VM {
    this.tokens.map((line) => {
      this.bytecode.push([]);
      let tmp = {
        type: '',
        name: '',
        value: '',
      };
      this.state = [];
      line.map((item) => {
        const {
          token,
          value,
        }: Token = item;
        if (bytecode[token]) {
          this.bytecode.slice(-1)[0].push(bytecode[token]);
        }
        if (token === 'STRING') {
          const stringSymbolBytecode: string = this.findIdentifier();
          this.stack.symbols[stringSymbolBytecode] = {
            bytecode: value
              .slice(1, value.length - 1)
              .split('')
              .map((x) => x.charCodeAt(0))
              .map((x) => x.toString(16))
              .map((x) => `0x${x}`),
            type: 'string',
          };
          if (this.state.length > 0 && this.state.slice(-1)[0] === 'VARIABLE::DECLARATION') {
            this.stack.values[tmp.name].value = stringSymbolBytecode;
          }
          this.bytecode.slice(-1)[0].push(stringSymbolBytecode);
        } else if (token === 'NUMBER') {
          const numberSymbolBytecode: string = this.findIdentifier();
          this.stack.symbols[numberSymbolBytecode] = {
            bytecode: [`0x${Number(value).toString(16)}`],
            type: 'number',
          };
          this.bytecode.slice(-1)[0].push(numberSymbolBytecode);
        } else if (token === 'TYPE') {
          this.state.push(`VARIABLE::${value.toUpperCase()}`);
          tmp.type = value;
        } else if (token === 'WORD') {
          const variableNameBytecode: Array<string> = value
            .split('')
            .map((x) => x.charCodeAt(0))
            .map((x) => x.toString(16))
            .map((x) => `0x${x}`);
          if (this.state.length > 0 && this.state.slice(-1)[0].startsWith('VARIABLE::')) {
            const variableSymbolBytecode: string = this.findIdentifier();
            if (Object.values(this.stack.values)[0]) {
              if (!this.arrayContainsArray(
                Object.values(this.stack.values)[0].bytecode,
                variableNameBytecode,
              )) {
                this.stack.values[variableSymbolBytecode] = {
                  bytecode: variableNameBytecode,
                  type: tmp.type,
                };
              }
            } else {
              this.stack.values[variableSymbolBytecode] = {
                bytecode: variableNameBytecode,
                type: tmp.type,
              };
            }
            tmp.name = variableSymbolBytecode;
            this.state.pop();
            this.state.push('VARIABLE::DECLARATION');
            this.bytecode.slice(-1)[0].push(tmp.name);
          } else {
            this.bytecode.slice(-1)[0].push(
              Object
                .entries(this.stack.values)
                .filter((x) => this.arrayContainsArray(x[1], variableNameBytecode))[0][0],
            );
          }
        }
        return true;
      });
      tmp = {
        name: '',
        type: '',
        value: '',
      };
      return true;
    });
    return {
      stack: this.stack,
      bytecode: this.bytecode,
    };
  }
}