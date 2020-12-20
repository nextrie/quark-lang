import { File } from './utils/file.ts';
import { Compiler } from './core/compiler.ts';

async function main(): Promise<void> {
  // Getting sample code content and interpreting it
  const script: string = await File.read('sample/index.qrk');
  Compiler.run(script);
}

await main();
