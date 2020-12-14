import { Lexer } from './core/lexer.ts';
import { File } from './utils/file.ts';

async function main(): Promise<void> {
  // Getting sample code content
  const script: string = await File.read('sample/index.qrk');
  // Printing token list
  console.log((new Lexer(script)).lexer());
}

await main();
