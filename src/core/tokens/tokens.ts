/*//////////////////////////////////////
               Quark lang
                 Tokens
//////////////////////////////////////*/

export default {
  COMMENT: /#.*?/,
  STRING: /".*?"/,
  NUMBER: /\d+/,

  TYPE: /(String|int)/,
  DECLARATION: /=/,
  RETURN: /return/,

  PAREN_OP: /\(/,
  PAREN_CL: /\)/,
  CURV_OP: /{/,
  CURV_CL: /}/,
  COMMA: /,/,

  SPACE: /\s+/,
  END: /;/,
  WORD: /\w+/,
};