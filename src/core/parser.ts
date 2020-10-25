/* eslint-disable no-param-reassign */
/*//////////////////////////////////////
               Quark lang
                 Parser
//////////////////////////////////////*/

import Tokenizer from 'core/tokenizer';
import { Token } from 'interfaces/token';
import Tokens from 'tokens';
import { Node } from 'interfaces/node';
import { Types } from 'interfaces/types';

export default class Parser {
  private code: Array<string>;

  private ast: Node = {
    type: Types.Program,
    raw: '',
    children: [],
  };

  private tokens: Array<Array<Token>> = [];

  constructor(code: string) {
    this.code = code
      .split(/\r?\n/g)
      .join('')
      .split(/;/g)
      .filter((x) => x.length > 0);
    Tokenizer.addTokenSet(Tokens);
    this.code.map((line: string): boolean => {
      this.tokens.push(Tokenizer.tokenize(line));
      return true;
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private program(tokens: Token[], index: number, ast: Node) {
    ast.children.push({
      type: Types.Any,
      raw: '',
      children: [],
      parent: ast,
    });
    this.any(tokens, index, ast.children.slice(-1)[0]);
  }

  // eslint-disable-next-line class-methods-use-this
  private word(tokens: Token[], index: number, ast: Node) {
    // eslint-disable-next-line no-param-reassign
    ast.type = Types.Keyword;
    // eslint-disable-next-line no-param-reassign
    ast.raw = tokens[index].value;
    this.any(tokens, index + 1, ast);
  }

  private bracket(tokens: Token[], index: number, ast: Node) {
    const token: Token = tokens[index];
    if (token.value === '(' && ast.type === Types.Keyword) {
      // eslint-disable-next-line no-param-reassign
      ast.type = Types.FunctionCall;
      ast.children.push({
        type: Types.Any,
        raw: '',
        children: [],
        parent: ast,
      });
      return this.any(tokens, index, ast.children.slice(-1)[0]);
    }
    if (token.value === ')' && ast.type === Types.FunctionCall) {
      return this.any(tokens, index + 1, ast.parent);
    }
    return this.any(tokens, index + 1, ast);
  }

  private string(tokens: Token[], index: number, ast: Node) {
    const token: Token = tokens[index];
    ast.type = Types.String;
    ast.raw = token.value;
    this.any(tokens, index + 1, ast.parent);
  }

  private comma(tokens: Token[], index: number, ast: Node) {
    ast.children.push({
      type: Types.Any,
      raw: '',
      children: [],
      parent: ast,
    });
    this.any(tokens, index + 1, ast.children.slice(-1)[0]);
  }

  // eslint-disable-next-line class-methods-use-this
  private any(tokens: Token[], index: number, ast: Node) {
    const token: Token = tokens[index];
    if (!token) return;
    switch (token.token) {
      case 'WORD':
        this.word(tokens, index, ast);
        break;
      case 'PAREN_OP': case 'PAREN_CL':
        this.bracket(tokens, index, ast);
        break;
      case 'STRING':
        this.string(tokens, index, ast);
        break;
      case 'COMMA':
        this.comma(tokens, index, ast);
        break;
      default:
        break;
    }
  }

  public init() {
    this.tokens.map((tokens: Array<Token>): boolean => {
      this.program(tokens.filter((x: Token) => x.token), 0, this.ast);
      return true;
    });
    function noCircular(key: string, value: string): undefined | string {
      if (key === 'parent') return undefined;
      return value;
    }
    console.log(JSON.stringify(this.ast, noCircular, 2));
  }
}