/*//////////////////////////////////////
               Quark lang
                   VM
////////////////////////////////////// */

import { VM } from 'interfaces/vm';
import { Stack } from 'interfaces/stack';
import bytecode from 'vm/bytecode';

export default class VirtualMachine {
  private vm: VM;

  private stack: Stack;

  private symbols: object;

  private values: object;

  private bytecode: Array<Array<string>>;

  private state: string;

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

  public run(): void {
    this.bytecode.map((line: Array<string>) => {
      line.map((x: string) => {
        if (this.findStateByBytecode(x)) this.state = this.findStateByBytecode(x);
        else if (this.findSymbolByBytecode(x)) {
          const symbol: any = this.symbols[this.findSymbolByBytecode(x)];
          let value: string | number;
          if (symbol.type === 'string') {
            value = symbol.bytecode
              .map((byte: string) => String.fromCharCode(parseInt(byte, 16)))
              .join('');
          } else if (symbol.type === 'number') {
            value = symbol.bytecode
              .map((byte: string) => parseInt(byte, 16))
              .join('');
          }
          if (this.state === 'PRINT') process.stdout.write(`${value}\n`);
        }
        return true;
      });
      return true;
    });
  }
}