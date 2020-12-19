import { Parser, Node } from './core/parser.ts';
import { File } from './utils/file.ts';
import { beautify } from './utils/json.ts';
import { Optimizer } from './core/optimizer.ts';

async function main(): Promise<void> {
  // Getting sample code content
  const script: string = await File.read('sample/index.qrk');

  // Printing parse method output
  const ast: Node = new Parser(script).parse();
  printAST(ast);

  printAST(Optimizer.optimize(ast));
}

export function printAST(ast: Node) {
  beautify(ast);
  console.log(JSON.stringify(ast, null, 2));
}

await main();
