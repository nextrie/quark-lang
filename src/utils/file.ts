export class File {
  // Static read method
  public static async read(path: string | string[], encoding: string = 'utf-8'): Promise<string> {
    // Checking if array and converting it to string
    if (Array.isArray(path)) path = path.join('');
    try {
      // Reading and decoding text content
      return new TextDecoder(encoding).decode(await Deno.readFile(path));
    } catch (exception) {
      // Throwing error if error occurs
      throw exception;
    }
  }
}