/**
 * micromark-extension-math-parens
 *
 * Micromark extension that adds \(...\) as inline math delimiters.
 * This complements remark-math's $...$ support.
 *
 * The extension registers a text construct for character code 92 (\)
 * that specifically matches \(...\) patterns. When \ is followed by
 * anything other than (, it falls through to the default escape handling.
 *
 * The fromMarkdown extension converts the tokens to mdast inlineMath nodes
 * that rehype-katex can render.
 */

// ── micromark syntax extension ───────────────────────────────────────

/**
 * Create a micromark extension for \(...\) inline math.
 * @returns {import('micromark-util-types').Extension}
 */
export function mathParensSyntax() {
  return {
    text: {
      [92]: mathParensConstruct  // 92 = \
    }
  };
}

/** @type {import('micromark-util-types').Construct} */
const mathParensConstruct = { tokenize: tokenizeMathParens, name: "mathParens" };

/**
 * Tokenizer for \(...\) inline math.
 * @this {import('micromark-util-types').TokenizeContext}
 * @type {import('micromark-util-types').Tokenizer}
 */
function tokenizeMathParens(effects, ok, nok) {
  return start;

  /**
   * Start: we've seen \ (code 92). Consume it and check for (.
   * @type {import('micromark-util-types').State}
   */
  function start(code) {
    if (code === 92) { // \
      effects.enter("mathInline");
      effects.enter("mathInlineOpen");
      effects.consume(code); // consume \
      return openParen;
    }
    return nok(code);
  }

  /**
   * After \, expecting (
   * @type {import('micromark-util-types').State}
   */
  function openParen(code) {
    if (code === 40) { // (
      effects.consume(code); // consume (
      effects.exit("mathInlineOpen");
      return contentStart;
    }
    // Not \(, so this is just an escaped character - bail out
    effects.exit("mathInline");
    return nok(code);
  }

  /**
   * After \(, now reading math content
   * @type {import('micromark-util-types').State}
   */
  function contentStart(code) {
    if (code === null) {
      // Unclosed math - treat as regular text
      return nok(code);
    }
    if (code === 92) { // \ - could be start of \)
      return potentialClose;
    }
    // Regular content
    effects.enter("mathInlineData");
    effects.consume(code);
    return content;
  }

  /**
   * Reading math content
   * @type {import('micromark-util-types').State}
   */
  function content(code) {
    if (code === null) {
      effects.exit("mathInlineData");
      return nok(code);
    }
    if (code === 92) { // \ - could be start of \)
      effects.exit("mathInlineData");
      return potentialClose;
    }
    effects.consume(code);
    return content;
  }

  /**
   * Saw \ inside math content, checking for )
   * We receive the \ character and need to consume it,
   * then check the next character for ).
   * @type {import('micromark-util-types').State}
   */
  function potentialClose(code) {
    // We receive \ (code 92) here
    if (code === 92) { // \
      return afterBackslash;
    }
    // Shouldn't happen, but handle gracefully
    effects.enter("mathInlineData");
    effects.consume(code);
    return content;
  }

  /**
   * After consuming \, check next char for )
   * @type {import('micromark-util-types').State}
   */
  function afterBackslash(code) {
    if (code === 41) { // )
      // This is the close delimiter \)
      effects.enter("mathInlineClose");
      effects.consume(code); // consume )
      effects.exit("mathInlineClose");
      effects.exit("mathInline");
      return ok;
    }
    // Not \), the \ was just content
    effects.enter("mathInlineData");
    effects.consume(92); // consume the \ as data
    effects.exit("mathInlineData");
    if (code === null) {
      return nok(code);
    }
    // Continue reading after the \
    return contentStart(code);
  }
}


// ── mdast fromMarkdown extension ─────────────────────────────────────

/**
 * Create a fromMarkdown extension that converts mathInline tokens
 * to mdast inlineMath nodes (compatible with remark-math/rehype-katex).
 * @returns {import('mdast-util-from-markdown').Extension}
 */
export function mathParensFromMarkdown() {
  return {
    enter: {
      mathInline: enterMathInline,
    },
    exit: {
      mathInline: exitMathInline,
      mathInlineData: exitMathInlineData,
    }
  };
}

/** @type {import('mdast-util-from-markdown').Handle} */
function enterMathInline(token) {
  this.enter(
    { type: "inlineMath", value: "", data: { hName: "inlineMath" } },
    token
  );
}

/** @type {import('mdast-util-from-markdown').Handle} */
function exitMathInline(token) {
  this.exit(token);
}

/** @type {import('mdast-util-from-markdown').Handle} */
function exitMathInlineData(token) {
  const value = this.sliceSerialize(token);
  const node = /** @type {{type: string, value: string}} */ (this.stack[this.stack.length - 1]);
  node.value += value;
}


// ── Remark plugin ────────────────────────────────────────────────────

/**
 * Remark plugin that adds \(...\) inline math support.
 * Must be used AFTER remark-math.
 *
 * @returns {undefined}
 */
export function remarkMathParens() {
  // @ts-expect-error: TS is wrong about `this`.
  const self = /** @type {import('unified').Processor} */ (this);
  const data = self.data();

  const micromarkExtensions =
    data.micromarkExtensions || (data.micromarkExtensions = []);
  const fromMarkdownExtensions =
    data.fromMarkdownExtensions || (data.fromMarkdownExtensions = []);

  micromarkExtensions.push(mathParensSyntax());
  fromMarkdownExtensions.push(mathParensFromMarkdown());
}
