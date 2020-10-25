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

  private goTo(type: Types, ast: Node) {
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
    if (ast.type === Types.Any) {
      ast.type = Types.Keyword;
      ast.raw = tokens[index].value;
    } else if (ast.type === Types.Declaration) {
      ast.params = {};
      ast.params.name = tokens[index].value;
    }
    this.any(tokens, index + 1, ast);
  }

  private bracket(tokens: Token[], index: number, ast: Node) {
    const token: Token = tokens[index];
    if (token.value === '(' && ast.type === Types.Keyword) {
      ast.type = Types.FunctionCall;
      ast.params = {};
      ast.params.arguments = [];
      ast.params.arguments.push({
        type: Types.Any,
        raw: '',
        children: [],
        parent: ast,
      });
      return this.any(tokens, index, ast.params.arguments.slice(-1)[0]);
    }
    if (token.value === '(' && ast.type === Types.Declaration) {
      ast.type = Types.FunctionDeclaration;
      ast.params.arguments = [];
      ast.params.arguments.push({
        type: Types.Any,
        raw: '',
        children: [],
        parent: ast,
      });
      return this.any(tokens, index, ast.params.arguments.slice(-1)[0]);
    }
    if (token.value === ')' && ast.type === Types.FunctionCall) {
      return this.any(tokens, index + 1, ast.parent);
    }
    if (token.value === '{') {
      this.currentTokenIndex += 1;
      return this.program(
        this.tokens[this.currentTokenIndex],
        0,
        this.goTo(Types.FunctionDeclaration, ast),
      );
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
    if (ast.type === Types.FunctionCall) {
      ast.params.arguments.push({
        type: Types.Any,
        raw: '',
        children: [],
        parent: ast,
      });
      return this.any(tokens, index + 1, ast.params.arguments.slice(-1)[0]);
    }
    if (ast.parent.type === Types.FunctionDeclaration) {
      ast.parent.params.arguments.push({
        type: Types.Any,
        raw: '',
        children: [],
        parent: ast,
      });
      return this.any(tokens, index + 1, ast.parent.params.arguments.slice(-1)[0]);
    }
    return null;
  }

  private type(tokens: Token[], index: number, ast: Node) {
    ast.type = Types.Declaration;
    ast.raw = tokens[index].value;
    return this.any(tokens, index + 1, ast);
  }

  private end(tokens: Token[], index: number, ast: Node) {
    this.currentTokenIndex += 1;
    if (!ast.parent) return this.program(this.tokens[this.currentTokenIndex], 0, ast);
    return this.program(this.tokens[this.currentTokenIndex], 0, ast.parent);
  }

  // eslint-disable-next-line class-methods-use-this
  private any(tokens: Token[], index: number, ast: Node) {
    const token: Token = tokens[index];
    if (!token) return;
    switch (token.token) {
      case 'WORD':
        this.word(tokens, index, ast);
        break;
      case 'PAREN_OP': case 'PAREN_CL': case 'CURV_OP': case 'CURV_CL':
        this.bracket(tokens, index, ast);
        break;
      case 'STRING':
        this.string(tokens, index, ast);
        break;
      case 'COMMA':
        this.comma(tokens, index, ast);
        break;
      case 'TYPE':
        this.type(tokens, index, ast);
        break;
      case 'END':
        this.end(tokens, index, ast);
        break;
      default:
        break;
    }
  }

  public init() {
    this.tokens = this.tokens.map((tokens: Token[]) => tokens.filter((x: Token) => x.token !== 'SPACE'));
    this.program(this.tokens[this.currentTokenIndex].filter((x: Token) => x.token !== 'SPACE'), 0, this.ast);
    function noCircular(key: string, value: string): undefined | string {
      if (key === 'parent') return undefined;
      return value;
    }
    console.log(JSON.stringify(this.ast, noCircular, 2));
  }
}