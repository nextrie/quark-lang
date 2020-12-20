import {ExpressionTypes, Node, Parser, Types} from './parser.ts';
import {Optimizer} from './optimizer.ts';

export class Compiler {
  private static output: string[] = [];
  private static FunctionCall(ast:  Node): Node {
    this.output.push(`${ast.params.name}(`);
    ast.children.map((child: Node, index: number) => {
      this.Any(child);
      if (index < ast.children.length - 1) this.output.push(',');
    });
    this.output.push(')');
    return ast;
  }

  private static String(ast: Node): Node | string {
    if (!ast.raw) return ast;
    this.output.push(ast.raw);
    return ast.raw;
  }

  private static VariableDefinition(ast: Node): Node {
    console.log(ast);
    return ast;
  }

  private static Node(ast: Node): Node {
    if (!ast.params.name && ast.children) {
      ast.children.map((child: Node) => this.Any(child));
    } else {
      switch(ast.params.type) {
        case ExpressionTypes.FunctionCall:
          return this.FunctionCall(ast);
        case ExpressionTypes.VariableDefinition:
          return this.VariableDefinition(ast);
      }
    }
    return ast;
  }

  private static Any(ast: Node): Node | string {
    switch(ast.type) {
      case Types.Node:
        return this.Node(ast);
      case Types.String: case Types.Keyword:
        return this.String(ast);
    }
    return ast;
  }

  public static run(source: Node | string) {
    if (typeof source === 'string') source = Optimizer.optimize((new Parser(source).parse()));
    this.Any(source);
    console.log(this.output);
    return this.output;
  }
}