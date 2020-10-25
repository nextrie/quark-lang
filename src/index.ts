/* //////////////////////////////////////
               Quark lang
                  Main
////////////////////////////////////// */

import Parser from 'core/parser';
import * as FS from 'fs';

const parser: Parser = new Parser(FS.readFileSync('sample/index.qrk', 'utf-8'));

parser.init();