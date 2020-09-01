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

  // eslint-disable-next-line class-methods-use-this
  private checkStackCategory(byte: string): string {
    if (this.stack.symbols[byte]) return 'symbols';
    return 'values';
  }

  private getInitialSymbolInValue(value: Value) {
    if (!value) return value;
    if (this.checkStackCategory(value.bound) === 'symbols') return this.stack.symbols[value.bound];
    return this.getInitialSymbolInValue(this.stack.values[value.bound]);
  }

  public run(): void {
    this.bytecode.map((line: Array<string>) => {
      this.expression = [];
      this.state = '';
      line.map((element: string) => {
        if (this.findStateByBytecode(element)) this.state = this.findStateByBytecode(element);
        else if (this.state === 'PRINT') {
          let bytes: Symbol;
          if (!this.stack.values[element]) bytes = this.findSymbolByBytecode(element);
          else if (this.checkStackCategory(this.stack.values[element]) === 'values') {
            if (this.checkStackCategory(this.stack.values[element].bound) === 'values') {
              bytes = this.getInitialSymbolInValue(this.stack.values[element]);
            }
          }
          if (bytes) this.expression.push(this.bytecodesToValue(bytes));
          else {
            const boundBytes: Symbol = this.findSymbolByBytecode(this.stack.values[element].bound);
            if (boundBytes) this.expression.push(this.bytecodesToValue(boundBytes));
          }
        } else if (this.state === 'TYPE') {
          this.tmp = {
            name: this.stack.values[element].name,
            bytecode: element,
          };
          this.state = 'VARIABLE::DECLARATION';
        } else if (this.state === 'VARIABLE::DECLARATION') {
          this.stack.values[this.tmp.bytecode].bound = element;
        } else if (this.state === 'VARIABLE::MODIFICATION') {
          if (this.checkStackCategory(element) === 'symbols') {
            const symbol: Symbol = this.findSymbolByBytecode(element);
            this.symbols[this.stack.values[this.tmp.bytecode].bound].value = symbol.value;
          } else {
            this.stack.values[this.tmp.bytecode].bound = this.stack.values[element].bound;
          }
        } else if (this.stack.values[element]) {
          this.state = 'VARIABLE::MODIFICATION';
          this.tmp = {
            name: this.stack.values[element].name,
            bytecode: element,
          };
        }
        return true;
      });
      if (this.state === 'PRINT') {
        this.expression = this.expression
          .map((element: string) => {
            if (!element.includes('\\n')) return element;
            process.stdout.write('\n');
            return undefined;
          })
          .filter((x: string | undefined) => x);
        if (this.expression.length > 0) process.stdout.write(`${this.expression.join(' ')}\n`);
      }
      return true;
    });
  }
}