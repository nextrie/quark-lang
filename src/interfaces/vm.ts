import { Stack } from 'interfaces/stack';

export interface VM {
  stack: Stack,
  bytecode: Array<Array<string>>,
  lastBytecode: string,
}