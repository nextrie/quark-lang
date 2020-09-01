/*//////////////////////////////////////
               Quark lang
                 Tokens
//////////////////////////////////////*/

export default {
  COMMENT: /#.*?/,
  STRING: /".*?"/,
  NUMBER: /\d+/,

  PRINT: /print/,
  TYPE: /(string|number)/,

  ADD: /\+/,
  MUL: /\*/,
  DIV: /\\/,
  MIN: /-/,

  REFERENCE: /&/,

  END: /;/,
  WORD: /\w+/,
};