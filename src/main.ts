import { Lexer } from './core/lexer.ts';

async function main(): Promise<void> {
  // Getting sample code content by reading file and decoding to UTF 8
  const script: string = new TextDecoder('utf-8').decode(await Deno.readFile('sample/index.qrk'));
  // Printing token list
  console.log((new Lexer(script)).lexer());
}

await main();
