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

  private currentTokenIndex: number = 0;

  private ast: Node = {
    type: Types.Program,
    raw: '',
    children: [],
  };

  private goTo(type: Types, ast: Node): Node {
    if (!ast.parent) return ast;
    if (ast.type !== type) return this.goTo(type, ast.parent);
    return ast;
  }

  private tokens: Array<Array<Token>> = [];

  constructor(code: string) {
    this.code = code
      .split(/\r?\n/g)
      .filter((x) => x.length > 0);
    Tokenizer.addTokenSet(Tokens);
    this.code.map((line: string): boolean => {
      this.tokens.push(Tokenizer.tokenize(line));
      return true;
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private program(tokens: Token[], index: number, ast: Node, token: Token) {
    if (!tokens) return;
    ast.children.push({
      type: Types.Any,
      raw: '',
      children: [],
      parent: ast,
    });
    this.any(tokens, index, ast.children.slice(-1)[0]);
  }

  private word(tokens: Token[], index: number, ast: Node, token: Token) {
    ast.type = Types.Keyword;
    ast.raw = token.value;
    return this.any(tokens, index + 1, ast);
  }

  private bracket(tokens: Token[], index: number, ast: Node, token: Token) {
    if (token.value === '(') {
      if (ast.type === Types.Keyword) {
        ast.params = {};
        ast.type = Types.FunctionCall;
        ast.params.arguments = [];
        ast.params.arguments.push({
          type: Types.Any,
          raw: '',
          children: [],
          parent: ast,
        });
        return this.any(tokens, index + 1, ast.params.arguments.slice(-1)[0]);
      }
    } else if (token.value === ')') {
      if (ast.parent.type === Types.FunctionCall) {
        return this.any(tokens, index + 1, ast.parent);
      }
    }
    return null;
  }

  private string(tokens: Token[], index: number, ast: Node, token: Token) {
    ast.type = Types.String;
    ast.raw = token.value;
    return this.any(tokens, index + 1, ast);
  }

  private comma(tokens: Token[], index: number, ast: Node, token: Token) {
    if (ast.parent.type && ast.parent.type === Types.FunctionCall) {
      ast.parent.params.arguments.push({
        type: Types.Any,
        raw: '',
        children: [],
        parent: ast.parent,
      });
      return this.any(tokens, index + 1, ast.parent.params.arguments.slice(-1)[0]);
    }
    return this.any(tokens, index + 1, ast);
  }

  private end(tokens: Token[], index: number, ast: Node, token: Token) {
    this.currentTokenIndex += 1;
    return this.program(
      this.tokens[this.currentTokenIndex],
      0,
      ast.parent,
      this.tokens[this.currentTokenIndex][0],
    );
  }

  // eslint-disable-next-line class-methods-use-this

  // eslint-disable-next-line class-methods-use-this
  private any(tokens: Token[], index: number, ast: Node) {
    if (!tokens) return;
    const token: Token = tokens[index];
    if (!token) return;
    switch (token.token) {
      case 'WORD':
        this.word(tokens, index, ast, token);
        break;
      case 'PAREN_OP': case 'PAREN_CL': case 'CURV_OP': case 'CURV_CL':
        this.bracket(tokens, index, ast, token);
        break;
      case 'STRING':
        this.string(tokens, index, ast, token);
        break;
      case 'COMMA':
        this.comma(tokens, index, ast, token);
        break;
      case 'END':
        this.end(tokens, index, ast, token);
        break;
      default:
        break;
    }
  }

  public init() {
    this.tokens = this.tokens.map((tokens: Token[]) => tokens.filter((x: Token) => x.token !== 'SPACE'));
    this.program(
      this.tokens[this.currentTokenIndex],
      0,
      this.ast,
      this.tokens[this.currentTokenIndex][0],
    );
    function noCircular(key: string, value: string): undefined | string {
      if (key === 'parent') return undefined;
      return value;
    }
    console.log(JSON.stringify(this.ast, noCircular, 2));
  }
}