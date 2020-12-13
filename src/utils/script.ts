async function getScripts(path: string = Deno.cwd()): Promise<object> {
  try {
    const content: string = new TextDecoder('utf-8').decode(await Deno.readFile(`${path}/package.json`));
    return JSON.parse(content).scripts ?? {};
  } catch (exception) {
    throw exception;
  }
}

getScripts();