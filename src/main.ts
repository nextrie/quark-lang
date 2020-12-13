import { Lexer } from './core/lexer.ts';

const script: string = new TextDecoder('utf-8').decode(await Deno.readFile('sample/index.qrk'));

console.log((new Lexer(script)).lexer());
