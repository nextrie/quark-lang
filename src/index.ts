/* //////////////////////////////////////
               Quark lang
                  Main
////////////////////////////////////// */

import Compiler from 'core/compiler';
import * as FS from 'fs';
import VirtualMachine from 'vm/vm';

const compiledOutput = new Compiler(FS.readFileSync('./sample/index.qrk', 'utf-8'));

const vm = new VirtualMachine(compiledOutput.compile());
vm.run();