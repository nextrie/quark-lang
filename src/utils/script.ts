// Importing command executor
import { exec as runCommand } from 'https://deno.land/x/exec/mod.ts';

// Function that return package's script content
async function getScripts(path: string = Deno.cwd()): Promise<Record<string, string>> {
  try {
    // Getting content from package file by reading file and decoding to UTF 8
    const content: string = new TextDecoder('utf-8').decode(await Deno.readFile(`${path}/package.json`));
    // Returning scripts part or empty object
    return JSON.parse(content).scripts ?? {};
  } catch (exception) {
    // Throwing error when some occurs
    throw exception;
  }
}

// Function that execute script
async function exec(script: string): Promise<void> {
  // Getting script content from function
  const scripts: Record<string, string> = await getScripts();
  // Running script
  await runCommand(scripts[script]);
}

// Looping all arguments as scripts
for (const arg of Deno.args) {
  // Executing script
  await exec(arg);
}