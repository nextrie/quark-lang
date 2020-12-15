import { Parser } from './core/parser.ts';
import { File } from './utils/file.ts';

async function main(): Promise<void> {
  // Getting sample code content
  const script: string = await File.read('sample/index.qrk');
  // Printing parse method output
  new Parser(script).parse();
}

await main();
