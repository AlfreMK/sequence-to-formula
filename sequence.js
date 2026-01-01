/**
 * @file Sequence class for polynomial interpolation of numerical sequences.
 * @requires ./utils.js - Provides {@link factorial} and {@link fallingFactorial} functions.
 * @see {@link https://youtu.be/YghBJcxkhPY|Derivando YouTube video} - Original inspiration for this app.
 * @see {@link https://en.wikipedia.org/wiki/Newton_polynomial|Newton polynomial} - Mathematical background.
 * @see {@link https://en.wikipedia.org/wiki/Finite_difference|Finite differences} - Theory behind the interpolation.
 */

/**
 * Represents a numerical sequence and provides methods to find the polynomial formula
 * that generates it using finite difference interpolation (Newton's forward difference formula).
 *
 * Given a finite set of sequence terms, this class computes the unique polynomial
 * of minimum degree that passes through all the given points.
 *
 * @class
 * @requires factorial - From utils.js, computes n!
 * @requires fallingFactorial - From utils.js, computes (n-1)(n-2)...(n-k)
 * @see {@link https://en.wikipedia.org/wiki/Newton_polynomial|Newton's forward difference formula}
 * @example
 * // Create a sequence from the first few terms
 * const seq = new Sequence(1, 4, 9, 16);  // Perfect squares
 * seq.getNthTerm(5);  // 25
 * seq.getNthTerm(10); // 100
 *
 * @example
 * // Fibonacci-like sequence
 * const fib = new Sequence(1, 1, 2, 3, 5, 8);
 * fib.toFormula();  // Prints the interpolating polynomial
 */
class Sequence {
  /**
   * Creates a new Sequence instance from the given terms.
   * Computes the intermediate coefficients needed for the interpolation formula.
   *
   * @param {...number} terms - The terms of the sequence, starting from the first term (n=1).
   * @example
   * new Sequence(2, 4, 6, 8)    // Arithmetic sequence
   * new Sequence(1, 4, 9, 16)   // Perfect squares
   * new Sequence(1, 1, 2, 3, 5) // First 5 Fibonacci numbers
   */
  constructor(...terms) {
    /** @type {number[]} The input sequence terms */
    this.terms = terms;
    /** @type {number[]} Intermediate coefficients used in the Newton interpolation formula */
    this.coefficients = new Array(terms.length);
    for (let i = 1; i < terms.length; i++) {
      this.coefficients[i - 1] = this._computeCoefficient(...terms.slice(0, i + 1))(i + 1);
    }
  }

  /**
   * Computes the interpolation coefficients for the Newton formula.
   * This is an internal helper method used during construction to build up
   * the divided differences needed for Newton's interpolation formula.
   *
   * @param {...number} terms - Subset of sequence terms to process.
   * @returns {function(number): number} A function that computes the coefficient for position n.
   * @private
   * @see {@link https://en.wikipedia.org/wiki/Divided_differences|Divided differences}
   */
  _computeCoefficient =
    (...terms) =>
    (n) => {
      let result = terms[0];
      let coefficient = terms[0];
      for (let i = 1; i < terms.length; i++) {
        result =
          ((terms[i] - this.coefficients[i - 1]) * fallingFactorial(n, i)) /
            factorial(i) +
          result;
        if (i < terms.length - 1) coefficient = result;
      }
      return coefficient;
    };

  /**
   * Creates a function that computes the nth term of the sequence using
   * Newton's forward difference interpolation formula.
   *
   * @param {...number} terms - The sequence terms to interpolate through.
   * @returns {function(number): number} A function that takes n and returns the nth term.
   * @private
   * @see {@link https://en.wikipedia.org/wiki/Newton_polynomial#Newton's_forward_difference_formula|Newton's forward difference formula}
   */
  _interpolate =
    (...terms) =>
    (n) => {
      let result = terms[0];
      for (let i = 1; i < terms.length; i++) {
        result =
          ((terms[i] - this.coefficients[i - 1]) * fallingFactorial(n, i)) /
            factorial(i) +
          result;
      }
      return result;
    };

  /**
   * Computes the value of the sequence at position n using the interpolated polynomial.
   * This is the main method for getting sequence values beyond the initial terms.
   *
   * @param {number} n - The position in the sequence (1-indexed).
   * @returns {number} The value of the sequence at position n.
   * @example
   * const seq = new Sequence(1, 4, 9, 16);
   * seq.getNthTerm(1);  // 1
   * seq.getNthTerm(5);  // 25
   * seq.getNthTerm(10); // 100
   */
  getNthTerm = (n) => this._interpolate(...this.terms)(n);

  /**
   * Generates and prints a human-readable string representation of the polynomial formula.
   * The formula shows the explicit computation using factorials and products.
   *
   * @returns {string} The polynomial formula as a string.
   * @example
   * const seq = new Sequence(1, 4, 9);
   * seq.toFormula();
   * // Output: " f(n) = (9 - 4)(n-1)(n-2)/2! + (4 - 1)(n-1)/1! + 1"
   */
  toFormula() {
    const { terms, coefficients } = this;
    let formula = " f(n) = ";
    for (let k = terms.length; k > 1; k--) {
      let factorProduct = "";
      for (let i = k - 1; i >= 1; i--) {
        factorProduct += `(n-${k - i})`;
      }
      factorProduct += `/${k - 1}!`;

      formula += `(${terms[k - 1]} - ${coefficients[k - 2]})${factorProduct}`;
      if (k > 1) {
        formula += " + ";
      }
    }
    formula += `${terms[0]}`;
    console.log(formula);
    return formula;
  }

  /**
   * Generates a LaTeX-formatted string representation of the polynomial formula.
   * Useful for rendering the formula in mathematical documents or web pages
   * using LaTeX rendering libraries (e.g., MathJax, KaTeX).
   *
   * @returns {string} The polynomial formula formatted in LaTeX syntax.
   * @example
   * const seq = new Sequence(1, 4, 9);
   * seq.toLatex();
   * // Returns: " f(n) = (9 - 4)\frac{\displaystyle\prod_{k=1}^{2} (n - k)}{2!}\\ + ..."
   */
  toLatex() {
    const { terms, coefficients } = this;
    let formula = " f(n) = ";
    for (let k = terms.length; k > 1; k--) {
      const fractionTerm = `\\frac{\\displaystyle\\prod_{k=1}^{${k - 1}} (n - k)}{${k - 1}!}`;
      formula += `(${terms[k - 1]} - ${coefficients[k - 2]})${fractionTerm}`;
      if (k > 1) {
        formula += "\\\\ + ";
      }
    }
    formula += `${terms[0]}`;
    return formula;
  }
}

// const test = new Sequence(20, 10, 100);
// test.toLatex();
