export class File {
  public static async read(path: string | string[], encoding: string = 'utf-8'): Promise<string> {
    if (Array.isArray(path)) path = path.join('');
    try {
      // Decoding file content cause it's Byte array
      return new TextDecoder(encoding).decode(await Deno.readFile(path));
    } catch (exception) {
      throw exception;
    }
  }
}