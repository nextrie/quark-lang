/*//////////////////////////////////////
               Quark lang
                   VM
////////////////////////////////////// */

import { VM } from 'interfaces/vm';
import { Stack } from 'interfaces/stack';
import bytecode from 'vm/bytecode';
import operators from 'core/tokens/operators';
// import * as jesp from 'jsep';

export default class VirtualMachine {
  private vm: VM;

  private stack: Stack;

  private symbols: object;

  private values: object;

  private bytecode: Array<Array<string>>;

  private state: string;

  private expression: Array<string> = [];

  private variables: object = {};

  constructor(vm: VM) {
    this.vm = vm;
    this.stack = this.vm.stack;
    this.symbols = this.stack.symbols;
    this.values = this.stack.values;
    this.bytecode = this.vm.bytecode;
  }

  // eslint-disable-next-line class-methods-use-this
  private findStateByBytecode(byte: string): string | undefined {
    const results: [string, string][] = Object.entries(bytecode).filter((x) => x[1] === byte);
    return results && results.length > 0 ? results[0][0] : undefined;
  }

  // eslint-disable-next-line class-methods-use-this
  private findSymbolByBytecode(byte: string): string | undefined {
    const results: [string, string][] = Object.entries(this.symbols).filter((x) => x[0] === byte);
    return results && results.length > 0 ? results[0][0] : undefined;
  }

  // eslint-disable-next-line class-methods-use-this
  private findValueByBytecode(byte: string): string | undefined {
    const results: [string, string][] = Object.entries(this.values).filter((x) => x[0] === byte);
    return results && results.length > 0 ? results[0][0] : undefined;
  }

  public run(): void {
    this.bytecode.map((line: Array<string>) => {
      this.expression = [];
      this.state = '';
      line.map((x: string) => {
        if (this.findStateByBytecode(x)) {
          const token: string = this.findStateByBytecode(x);
          if (token === 'PRINT') {
            this.state = token;
          } else if (token === 'TYPE') {
            this.state = 'VARIABLE::DECLARATION';
          } else {
            this.expression.push(operators[token]);
          }
        } else if (this.findSymbolByBytecode(x)) {
          const symbol: any = this.symbols[this.findSymbolByBytecode(x)];
          if (symbol.type === 'string') {
            this.expression.push(symbol.bytecode
              .map((byte: string) => String.fromCharCode(parseInt(byte, 16)))
              .join(''));
          } else if (symbol.type === 'number') {
            this.expression.push(symbol.bytecode
              .map((byte: string) => parseInt(byte, 16))
              .join(''));
          }
        } else if (this.findValueByBytecode(x)) {
          const variableBytecode: string = this.values[this.findValueByBytecode(x)].value;
          const symbol: any = this.symbols[variableBytecode];
          if (symbol.type === 'string') {
            this.expression.push(symbol.bytecode
              .map((byte: string) => String.fromCharCode(parseInt(byte, 16)))
              .join(''));
          } else if (symbol.type === 'number') {
            this.expression.push(symbol.bytecode
              .map((byte: string) => parseInt(byte, 16))
              .join(''));
          }
        }
        return true;
      });
      // JSON.stringify(jesp.default(this.expression.join(' ')), null, 2)
      if (this.state === 'PRINT') process.stdout.write(`${this.expression.join(' ')}\n`);
      return true;
    });
  }
}