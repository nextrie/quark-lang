/*//////////////////////////////////////
               Quark lang
                 Tokens
//////////////////////////////////////*/

export default {
  STRING: /".*?"/,
  NUMBER: /\d+/,

  TYPE: /(string|int)/,

  PRINT: /print/,
  SPACE: /\s+/,

  ADD: /\+/,
  MUL: /\*/,
  DIV: /\\/,
  MIN: /-/,

  END: /;/,
  WORD: /\w+/,
};