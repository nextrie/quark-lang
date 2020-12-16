// Function to remove circular references in object
import { Block, Types } from '../core/parser.ts';

export const getCircularReplacer = () => {
  // Contains visited value
  const seen = new WeakSet();
  return (key: string, value: string) => {
    // Checking if value is an object
    if (typeof value === 'object' && value !== null) {
      // Checking if value has been already visited
      if (seen.has(value)) {
        // Returning nothing
        return;
      }
      // Adding value to seen
      seen.add(value);
    }
    // Returning default value
    return value;
  };
};

export interface CleanNode {
  type: Types,
  raw?: string | number,
  params?: Block,
  children?: CleanNode[],
  parent?: CleanNode,
}

export const beautify = (ast: CleanNode): Record<string, any> => {
  if (!ast.params || !ast.params.name) delete ast.params;
  if (!ast.children || ast.children.length === 0) delete ast.children;
  if (ast.parent) delete ast.parent;
  if (ast.children && ast.children.length > 0) for (let child of ast.children) beautify(child);
  return ast;
}