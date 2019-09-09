/*
Language: Pawn
Author: Ali "AssassiN" Gerami <AilSynthax@gmail.com>
Contributors: 
Category: common, system
*/

function(hljs) {
  var PAWN_PRIMITIVE_TYPES = {
    className: 'keyword',
    begin: ''
  };

  var STRINGS = {
    className: 'string',
    variants: [
      {
        begin: '"', end: '"',
        illegal: '\\n',
        contains: [hljs.BACKSLASH_ESCAPE]
      }
    ]
  };

  var NUMBERS = {
    className: 'number',
    variants: [
      { begin: '\\b(0b[01\']+)' },
      { begin: '(-?)(\\b0[xX][a-fA-F0-9\']+|(\\b[\\d\']+(\\.[\\d\']*)?|\\.[\\d\']+)([eE][-+]?[\\d\']+)?)' }
    ],
    relevance: 0
  };

  var PREPROCESSOR =       {
    className: 'meta',
    begin: /#\s*[a-z]+\b/, end: /$/,
    keywords: {
      'meta-keyword':
        'if defined else elif endif define undef warning error line ' +
        'pragma include tryinclude'
    },
    contains: [
      {
        begin: /\\\n/, relevance: 0
      },
      hljs.inherit(STRINGS, {className: 'meta-string'}),
      {
        className: 'meta-string',
        begin: /<[^\n>]*>/, end: /$/,
        illegal: '\\n',
      },
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE
    ]
  };

  var FUNCTION_TITLE = hljs.IDENT_RE + '\\s*\\(';

  var PAWN_KEYWORDS = {
    keyword: 'forward while char sizeof for static stock ' +
      'bool if public do goto enum else break case ' +
      'switch continue new throw return emit',
    built_in: 'Float',
    literal: 'true false'
  };

  var EXPRESSION_CONTAINS = [
    PAWN_PRIMITIVE_TYPES,
    hljs.C_LINE_COMMENT_MODE,
    hljs.C_BLOCK_COMMENT_MODE,
    NUMBERS,
    STRINGS
  ];

  return {
    aliases: ['pwn', 'inc', 'pawn'],
    keywords: PAWN_KEYWORDS,
    illegal: '</',
    contains: EXPRESSION_CONTAINS.concat([
      PREPROCESSOR,
      {
        begin: '\\b(stack)\\s*<', end: '>',
        keywords: PAWN_KEYWORDS,
        contains: ['self', PAWN_PRIMITIVE_TYPES]
      },
      {
        // This mode covers expression context where we can't expect a function
        // definition and shouldn't highlight anything that looks like one:
        // `return some()`, `else if()`, `(x*sum(1, 2))`
        variants: [
          {begin: /=/, end: /;/},
          {begin: /\(/, end: /\)/},
          {beginKeywords: 'return else', end: /;/}
        ],
        keywords: PAWN_KEYWORDS,
        contains: EXPRESSION_CONTAINS.concat([
          {
            begin: /\(/, end: /\)/,
            keywords: PAWN_KEYWORDS,
            contains: EXPRESSION_CONTAINS.concat(['self']),
            relevance: 0
          }
        ]),
        relevance: 0
      },
      {
        className: 'function',
        begin: '(' + hljs.IDENT_RE + '[\\*&\\s]+)+' + FUNCTION_TITLE,
        returnBegin: true, end: /[{;=]/,
        excludeEnd: true,
        keywords: PAWN_KEYWORDS,
        illegal: /[^\w\s\*&]/,
        contains: [
          {
            begin: FUNCTION_TITLE, returnBegin: true,
            contains: [hljs.TITLE_MODE],
            relevance: 0
          },
          {
            className: 'params',
            begin: /\(/, end: /\)/,
            keywords: PAWN_KEYWORDS,
            relevance: 0,
            contains: [
              hljs.C_LINE_COMMENT_MODE,
              hljs.C_BLOCK_COMMENT_MODE,
              STRINGS,
              NUMBERS,
              PAWN_PRIMITIVE_TYPES,
              // Count matching parentheses.
              {
                begin: /\(/, end: /\)/,
                keywords: PAWN_KEYWORDS,
                relevance: 0,
                contains: [
                  'self',
                  hljs.C_LINE_COMMENT_MODE,
                  hljs.C_BLOCK_COMMENT_MODE,
                  STRINGS,
                  NUMBERS,
                  PAWN_PRIMITIVE_TYPES
                ]
              }
            ]
          },
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE,
          PREPROCESSOR
        ]
      }
    ]),
    exports: {
      preprocessor: PREPROCESSOR,
      strings: STRINGS,
      keywords: PAWN_KEYWORDS
    }
  };
}
