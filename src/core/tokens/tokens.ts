/*//////////////////////////////////////
               Quark lang
                 Tokens
//////////////////////////////////////*/

export default {
  COMMENT: /#.*?/,
  STRING: /".*?"/,
  NUMBER: /\d+/,

  TYPE: /(String|Number|Array<.*?>)/,

  ADD: /\+/,
  MUL: /\*/,
  DIV: /\\/,
  MIN: /-/,

  REFERENCE: /&/,

  BRACKET_OP: /\[/,
  BRACKET_CL: /\]/,
  PAREN_OP: /\(/,
  PAREN_CL: /\)/,
  COMMA: /,/,

  EQUAL: /=/,

  END: /;/,
  WORD: /\w+/,
};