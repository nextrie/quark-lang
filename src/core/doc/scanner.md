# Scanner
The scanner is the part of Quark that scans the code to turn it into a list of tokens. Each token is composed of its identifier as well as the value.
### Functions

##### • Formating output
This function allows you to format the content of the arguments in order to return a variable based on the token interface.
```ts
function formatOutput(currentToken: string, tokenValue: string, tokenizer: any): Token;
```
##### • Updating values
The value update function allows you to store tokenizer values temporarily.
```ts
function updateValues(tempArray: any, values: Value, key: string): Value;
```
##### • Getting nearest token
This function allows you to obtain the nearest token.
```ts
function getNearestToken(tokens: object, string: string): Value;
```
##### • Scannering
This is the main function of the scanner that allows you to scan the entire text and cut it into several Tokens.
```ts
default function scanner(string: string, tokenizer): Array<Token>;
```