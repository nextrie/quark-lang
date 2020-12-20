import { Parser, Node } from './parser.ts';
import { Optimizer } from './optimizer.ts';

export class Interpreter {
  public static run(source: Node | string) {
    if (typeof source === 'string') source = Optimizer.optimize((new Parser(source).parse()));
    console.log(source);
  }
}