/* //////////////////////////////////////
               Quark lang
                  Main
////////////////////////////////////// */

import Compiler from 'core/compiler';
import * as FS from 'fs';

const compiledOutput = new Compiler(FS.readFileSync('./sample/index.qrk', 'utf-8'));

compiledOutput.compile();