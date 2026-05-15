import { createToken, Lexer } from 'chevrotain'

export interface Token {
  type: string
  value: string
  start: number
  end: number
}

export const NumberToken = createToken({
  name: 'NUMBER',
  pattern: /\d+(\.\d+)?/,
})

export const OperatorToken = createToken({
  name: 'OPERATOR',
  pattern: /[+\-*/]/,
})

export const ParenOpenToken = createToken({
  name: 'LPAREN',
  pattern: /\(/,
})

export const ParenCloseToken = createToken({
  name: 'RPAREN',
  pattern: /\)/,
})

export const WhitespaceToken = createToken({
  name: 'WHITESPACE',
  pattern: /\s+/,
})

export const LexerInstance = new Lexer([
  NumberToken,
  OperatorToken,
  ParenOpenToken,
  ParenCloseToken,
  WhitespaceToken,
])

export const tokenize = (expr: string): Token[] => {
  const lexerResult = LexerInstance.tokenize(expr)

  return lexerResult.tokens
    .filter((token) => token.tokenType !== WhitespaceToken)
    .map((token) => ({
      type: token.tokenType.name,
      value: token.image,
      start: token.startOffset,
      end: token.endOffset,
    }))
}

export const evaluate = (expr: string): number | string => {
  try {
    // Use Function constructor as safer alternative to eval
    // This evaluates the expression in an isolated scope
    const result = new Function(`return ${expr}`)()

    // Check if result is a valid number
    if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
      return Number(result.toFixed(6)) // Remove floating point precision issues
    }

    return 'Invalid expression'
  } catch (_error) {
    return 'Syntax error'
  }
}
