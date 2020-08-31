/*//////////////////////////////////////
               Quark lang
                 Tokens
//////////////////////////////////////*/

export default {
  STRING: /".*?"/,
  NUMBER: /\d+/,

  PRINT: /print/,
  TYPE: /(string|number)/,

  ADD: /\+/,
  MUL: /\*/,
  DIV: /\\/,
  MIN: /-/,

  END: /;/,
  WORD: /\w+/,
};