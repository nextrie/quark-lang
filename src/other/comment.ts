/* //////////////////////////////////////
               Quark lang
                Comments
////////////////////////////////////// */

export default class Comments {
  // Contains text that length match with main text.
  private static correctText: Array<string> = [];

  // Trails length coefficient.
  private static readonly coefficient: number = 4;

  // Trails start and end indicator.
  private static readonly trailsStart: string = '/*/';

  // Contains all trails length.
  private static trailsArray: Array<number> = [];

  // Needed amount of trails.
  private static trailsLength: number = 0;

  // Needed amount of spaces.
  private static spaceLength: Array<number> = [];

  /**
   * @private
   * @static
   *
   * @name        setTrailsLength
   * @description Set trails length
   * @author      NessMC
   */

  private static setTrailsLength(): void {
    // Looping all text elements.
    this.correctText.forEach((line) => (
      // Checking if trails length is even.
      ((line.length * this.coefficient - line.length) / 2) % 1 === 0
        // Pushing trails length to trailsArray variable.
        ? this.trailsArray.push(line.length * this.coefficient)
        // Else considering element is odd and adding 1 to make number even.
        : this.trailsArray.push(line.length * this.coefficient + 1)));

    // Returning maximum array value.
    this.trailsLength = Math.max(...this.trailsArray);
  }

  /**
   * @private
   * @static
   *
   * @name        setSpaceLength
   * @description Set space length
   * @author      NessMC
   */

  private static setSpaceLength(): void {
    // Loopingall text elements.
    this.correctText.forEach((line) => ((
      // Checking if trails length is even.
      (this.trailsLength - line.length) / 2) % 1 === 0
      // Pushing space length to spaceLength variable.
      ? this.spaceLength.push((this.trailsLength - line.length) / 2)
      // Else considering element is odd and adding 1 to make number even.
      : this.spaceLength.push(
        (this.trailsLength - line.length + 1) / 2,
      )));
  }

  /**
   * @public
   * @static
   *
   * @name        generate
   * @description Generate comment
   * @author      NessMC
   */

  public static generate(...text: Array<string>): string {
    // Text length percolation.
    this.correctText = text.filter((x) => (x.length % 2 === text[0].length % 2 ? x.length : ''));

    // Calling setters.
    this.setTrailsLength();
    this.setSpaceLength();

    // Creating array contains needed trails content.
    const trailsContent: Array<string> = [...this.trailsStart].concat(
      new Array(this.trailsLength - 3).fill('/'),
    );
    // Creating array contains needed space content .
    const spaceContent: Array<Array<string>> = this.correctText.map((x, index) => new Array(this.spaceLength[index]).fill(' '));
    // Concatenating texts with spaces.
    const textContent: Array<string> = this.correctText.map((x, index) => spaceContent[index]
      .join('')
      .concat(x)
      .concat(spaceContent[index].join('')));

    // Creating comment result with trails and texts.
    const result: string = `${trailsContent.join('')
    }\n${
      textContent.join('\n')
    }\n${
      trailsContent.reverse().join('')}`;

    return result;
  }
}
