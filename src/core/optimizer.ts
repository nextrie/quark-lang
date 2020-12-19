import { ExpressionTypes, Node, Types } from './parser.ts';

export interface Collector {
  from: number,
  occurrences: number,
  value: string,
}

export class Optimizer {
  public static optimize(ast: Node): Node {
    let collector: Collector | null;
    function optimizer(): Node {
      if (!ast.children) return ast;
      for (const index in ast.children) {
        const child = ast.children[index];
        if (ast.params?.type === ExpressionTypes.FunctionCall && ast.params.name === 'print') {
          if (!child.raw) return Optimizer.optimize(child);
          if (child.type === Types.String) {
            if (!collector) {
              collector = {
                from: Number(index),
                occurrences: 1,
                value: child.raw.slice(0, child.raw.length - 1),
              }
            } else {
              collector.value += ' ' + child.raw.slice(1, child.raw.length - 1);
              collector.occurrences++;
            }
          } else if (collector) {
            collector.value += '"';
            ast.children.splice(collector.from, collector.occurrences, { type: Types.String, children: [], parent: ast, raw: collector.value, params: {} });
            collector = null;
          }
        }
        Optimizer.optimize(child);
      }
      if (collector) {
        collector.value += '"';
        ast.children.splice(collector.from, collector.occurrences, { type: Types.String, children: [], parent: ast, raw: collector.value, params: {} });
        collector = null;
      }
      return ast;
    }
    return optimizer();
  }
}