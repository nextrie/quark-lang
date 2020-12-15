import { Parser, Node } from './core/parser.ts';
import { File } from './utils/file.ts';
import { getCircularReplacer } from './utils/json.ts';

async function main(): Promise<void> {
  // Getting sample code content
  const script: string = await File.read('sample/index.qrk');

  // Printing parse method output
  const ast: Node = new Parser(script).parse();
  console.log(JSON.stringify(ast, getCircularReplacer(), 2));
}

await main();
