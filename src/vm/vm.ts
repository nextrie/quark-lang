/*//////////////////////////////////////
               Quark lang
                   VM
////////////////////////////////////// */

import { VM } from 'interfaces/vm';
import { Stack } from 'interfaces/stack';
import bytecode from 'vm/bytecode';
// import operators from 'core/tokens/operators';
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
      line.map((element: string) => {
        process.stdout.write(`${element} `);
        return true;
      });
      process.stdout.write('\n');
      return true;
    });
  }
}