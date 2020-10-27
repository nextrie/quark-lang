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

  BRACKET: /(\(|\)|\{|\}|\[|\])/,
  COMMA: /,/,

  SPACE: /\s+/,
  END: /;/,
  WORD: /\w+/,
};