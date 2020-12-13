import { exec as runCommand } from 'https://deno.land/x/exec/mod.ts';
async function getScripts(path: string = Deno.cwd()): Promise<Record<string, string>> {
  try {
    const content: string = new TextDecoder('utf-8').decode(await Deno.readFile(`${path}/package.json`));
    return JSON.parse(content).scripts ?? {};
  } catch (exception) {
    throw exception;
  }
}

async function exec(script: string): Promise<void> {
  const scripts: Record<string, string> = await getScripts();
  await runCommand(scripts[script]);
}

for (const arg of Deno.args) {
  await exec(arg);
}