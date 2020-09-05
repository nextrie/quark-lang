/*//////////////////////////////////////
               Quark lang
                   VM
////////////////////////////////////// */

import { VM } from 'interfaces/vm';
import { Stack } from 'interfaces/stack';
import bytecode from 'vm/bytecode';
import { Symbol } from 'interfaces/symbol';
import { Value } from 'interfaces/stackValue';
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

  private tmp: any;

  constructor(vm: VM) {
    this.vm = vm;
    this.stack = this.vm.stack;
    this.symbols = this.stack.symbols;
    this.values = this.stack.values;
    this.bytecode = this.vm.bytecode;
  }

  // eslint-disable-next-line class-methods-use-this
  private findStateByBytecode(byte: string): string | undefined {
    const results: Array<string> = Object
      .entries(bytecode)
      .filter((x) => x[1] === byte)
      .map((x) => x[0]);
    return results.length > 0 ? results[0] : undefined;
  }

  private findSymbolByBytecode(byte: string): Symbol | undefined {
    const results: Array<Symbol> = Object
      .entries(this.symbols)
      .filter((x) => x[0] === byte)
      .map((x) => x[1]);
    return results.length > 0 ? results[0] : undefined;
  }

  // eslint-disable-next-line class-methods-use-this
  private bytecodesToValue(bytes: Symbol): string | undefined {
    if (!bytes) return undefined;
    if (bytes.type === 'string') {
      return bytes.value
        .map((x) => parseInt(x, 16))
        .map((x) => String.fromCharCode(x))
        .join('');
    }
    return bytes.value
      .map((x) => parseInt(x, 16))
      .join('');
  }

  private getBytecodeIdentifier(): string {
    let byte: string = (parseInt(this.vm.lastBytecode, 16) + 1).toString(16);
    if (byte.length === 2) byte = `0x${byte}`;
    else byte = `0x0${byte}`;
    this.vm.lastBytecode = byte;
    return byte;
  }

  // eslint-disable-next-line class-methods-use-this
  private checkStackCategory(byte: string): string {
    if (this.stack.symbols[byte]) return 'symbols';
    return 'values';
  }

  private getArrayValue(array, ...indexes) {
    // eslint-disable-next-line no-param-reassign
    array = array[indexes[0]];
    if (!this.stack.symbols[array]) return array;
    // eslint-disable-next-line no-param-reassign
    array = this.stack.symbols[array].values;
    return this.getArrayValue(array, indexes.slice(1));
  }

  private getInitialSymbolInValue(value: Value, index: number = 0) {
    if (!value) return value[index];
    value.bound.map((bound: string) => {
      if (this.checkStackCategory(bound) === 'symbols') return this.stack.symbols[bound][index];
      return this.getInitialSymbolInValue(this.stack.values[bound], index);
    });
    return undefined;
  }

  public run(): void {
    this.bytecode.map((line: Array<string>) => {
      this.expression = [];
      this.state = '';
      line.map((element: string) => {
        if (this.findStateByBytecode(element)) this.state = this.findStateByBytecode(element);
        else if (this.checkStackCategory(element) === 'values') {
          // console.log(this.stack.values[element]);
        }
        return true;
      });
      return true;
    });
  }
}