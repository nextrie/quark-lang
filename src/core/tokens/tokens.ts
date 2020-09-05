/*//////////////////////////////////////
               Quark lang
                 Tokens
//////////////////////////////////////*/

export default {
  COMMENT: /#.*?/,
  STRING: /".*?"/,
  NUMBER: /\d+/,

  PRINT: /print/,
  TYPE: /(String|Number|Array<.*?>)/,

  ADD: /\+/,
  MUL: /\*/,
  DIV: /\\/,
  MIN: /-/,

  REFERENCE: /&/,

  BRACKET_OP: /\[/,
  BRACKET_CL: /\]/,
  COMMA: /,/,

  EQUAL: /=/,

  END: /;/,
  WORD: /\w+/,
};