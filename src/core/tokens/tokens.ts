/*//////////////////////////////////////
               Quark lang
                 Tokens
//////////////////////////////////////*/

export default {
  COMMENT: /#.*?/,
  STRING: /".*?"/,
  NUMBER: /\d+/,

  IF: /if/,
  ELSE: /else/,

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
  CURV_OP: /{/,
  CURV_CL: /}/,
  COMMA: /,/,

  EQUAL: /=/,

  END: /;/,
  WORD: /\w+/,
};