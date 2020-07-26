/*//////////////////////////////////////
               Quark lang
                Comments
//////////////////////////////////////*/

export default class Comments {
    // Contains text that length match with main text.
    private static correct_text: Array<string> = []
    // Trails length coefficient.
    private static readonly coefficient: number = 4
    // Trails start and end indicator.
    private static readonly trails_start: string = '/*/'
    // Contains all trails length.
    private static trails_array: Array<number> = []
    // Needed amount of trails.
    private static trails_length: number = 0
    // Needed amount of spaces.
    private static space_length: Array<number> = []

    /**
     * @private
     * @static
     *
     * @name        set_trails_length
     * @description Set trails length
     * @author      NessMC
     */

    private static set_trails_length(): void {
        // Looping all text elements.
        for (const line of this.correct_text) {
            // Checking if trails length is odd.
            if (
                ((line.length * this.coefficient - line.length) / 2) % 1 === 0
            ) {
                this.trails_array.push(line.length * this.coefficient)
            } else {
                this.trails_array.push(line.length * this.coefficient + 1)
            }
        }

        this.trails_length = Math.max(...this.trails_array)
    }

    /**
     * @private
     * @static
     *
     * @name        set_space_length
     * @description Set space length
     * @author      NessMC
     */

    private static set_space_length(): void {
        // Loopingall text elements.
        for (const line of this.correct_text) {
            // Checking if trails length is odd.
            if (((this.trails_length - line.length) / 2) % 1 === 0) {
                // Pushing space length to space_length variable.
                this.space_length.push((this.trails_length - line.length) / 2)
            } else {
                // Pushing space length to space_length variable.
                this.space_length.push(
                    (this.trails_length - line.length + 1) / 2
                )
            }
        }
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
        this.correct_text = text.filter((x) =>
            x.length % 2 === text[0].length % 2 ? x.length : ''
        )

        // Calling setters.
        this.set_trails_length()
        this.set_space_length()

        // Creating array contains needed trails content.
        const trails_content: Array<string> = [...this.trails_start].concat(
            new Array(this.trails_length - 3).fill('/')
        )
        // Creating array contains needed space content .
        const space_content: Array<Array<string>> = this.correct_text.map((x, index) =>
            new Array(this.space_length[index]).fill(' ')
        )
        // Concatenating texts with spaces.
        const text_content: Array<string> = this.correct_text.map((x, index) =>
            space_content[index]
                .join('')
                .concat(x)
                .concat(space_content[index].join(''))
        )

        // Creating comment result with trails and texts.
        const result: string =
            trails_content.join('') +
            '\n' +
            text_content.join('\n') +
            '\n' +
            trails_content.reverse().join('')

        return result
    }
}
