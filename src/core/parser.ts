/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
/*//////////////////////////////////////
               Quark lang
                 Parser
//////////////////////////////////////*/

import Tokenizer from 'core/tokenizer';
import { Token } from 'interfaces/token';
import Tokens from 'tokens';
import { Node } from 'interfaces/node';
import { Types, Nodes } from 'interfaces/types';

export default class Parser {
  private code: string;

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

  private goToLastNode(ast: Node): Node {
    if (!ast.parent) return ast;
    if (Nodes.includes(ast.type)) return ast.parent;
    return this.goToLastNode(ast.parent);
  }

  private tokens: Token[] = [];

  constructor(code: string) {
    this.code = code
      .split(/\r?\n/g)
      .filter((x) => x.length > 0)
      .join('');
    Tokenizer.addTokenSet(Tokens);
    this.tokens = Tokenizer.tokenize(this.code);
  }

  // eslint-disable-next-line class-methods-use-this
  private program(tokens: Token[], index: number, ast: Node, token: Token): any {
    if (!tokens) return;
    if (!ast) return;
    ast.children.push({
      type: Types.Any,
      raw: '',
      children: [],
      parent: ast,
    });
    return this.any(tokens, index, ast.children.slice(-1)[0], token);
  }

  private word(tokens: Token[], index: number, ast: Node, token: Token) {
    if (ast.type !== Types.Declaration) {
      ast.type = Types.Keyword;
      ast.raw = token.value;
    } else {
      ast.params = {
        name: token.value,
      };
    }
    return this.any(tokens, index + 1, ast, tokens[index + 1]);
  }

  private bracket(tokens: Token[], index: number, ast: Node, token: Token) {
    if (token.value === '(') {
      if (ast.type === Types.Keyword) {
        ast.type = Types.FunctionCall;
        ast.params = {
          arguments: [],
        };
        ast.params.arguments.push({
          type: Types.Any,
          raw: '',
          children: [],
          parent: ast,
        });
        return this.any(tokens, index + 1, ast.params.arguments.slice(-1)[0], tokens[index + 1]);
      }
      if (ast.type === Types.Declaration) {
        ast.type = Types.FunctionDeclaration;
        ast.params.arguments = [];
        ast.params.arguments.push({
          type: Types.Any,
          raw: '',
          children: [],
          parent: ast,
        });
        return this.any(tokens, index + 1, ast.params.arguments.slice(-1)[0], tokens[index + 1]);
      }
    } else if (token.value === ')') {
      return this.any(tokens, index + 1, ast.parent, tokens[index + 1]);
    } else if (token.value === '{') {
      return this.program(tokens, index + 1, ast, tokens[index + 1]);
    } else if (token.value === '}') {
      return this.program(tokens, index + 1, this.goToLastNode(ast), tokens[index + 1]);
    }
  }

  private string(tokens: Token[], index: number, ast: Node, token: Token) {
    ast.type = Types.String;
    ast.raw = token.value;
    return this.any(tokens, index + 1, ast, tokens[index + 1]);
  }

  private comma(tokens: Token[], index: number, ast: Node, token: Token) {
    ast.parent.params.arguments.push({
      type: Types.Any,
      raw: '',
      children: [],
      parent: ast.parent,
    });
    return this.any(tokens, index + 1, ast.parent.params.arguments.slice(-1)[0], tokens[index + 1]);
  }

  public type(tokens: Token[], index: number, ast: Node, token: Token) {
    ast.type = Types.Declaration;
    ast.raw = token.value;
    return this.any(tokens, index + 1, ast, tokens[index + 1]);
  }

  public end(tokens: Token[], index: number, ast: Node, token: Token) {
    return this.program(tokens, index + 1, ast.parent, tokens[index + 1]);
  }

  public declaration(tokens: Token[], index: number, ast: Node, token: Token) {
    ast.type = Types.VariableDeclaration;
    ast.params = {
      name: token.value,
    };
    ast.children.push({
      type: Types.Any,
      raw: '',
      children: [],
      parent: ast,
    });
    return this.any(tokens, index + 1, ast.children.slice(-1)[0], tokens[index + 1]);
  }

  private any(tokens: Token[], index: number, ast: Node, token: Token) {
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
      case 'TYPE':
        this.type(tokens, index, ast, token);
        break;
      case 'DECLARATION':
        this.declaration(tokens, index, ast, token);
        break;
      default:
        break;
    }
  }

  public init() {
    this.tokens = this.tokens.filter((x: Token) => x.token !== 'SPACE');
    this.program(
      this.tokens,
      0,
      this.ast,
      this.tokens[0],
    );
    function noCircular(key: string, value: string): undefined | string {
      if (key === 'parent') return undefined;
      return value;
    }
    console.log(JSON.stringify(this.ast, noCircular, 2));
  }
}