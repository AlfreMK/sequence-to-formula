/**
 * Calculates the factorial of a non-negative integer.
 * @param {number} num - The non-negative integer to calculate the factorial of.
 * @returns {number} The factorial of `num` (i.e., num!).
 * @example
 * factorial(0)  // 1
 * factorial(5)  // 120 (5*4*3*2*1)
 * factorial(7)  // 5040
 */
const factorial = (num) => {
  let result = 1;
  for (let i = 2; i <= num; i++) result *= i;
  return result;
};

/**
 * Calculates the falling factorial (Pochhammer symbol) from `n-1` down to `n-length`.
 * This computes: (n-1) × (n-2) × ... × (n-length)
 *
 * Used in the finite difference interpolation formula for polynomial sequences.
 *
 * @param {number} n - The starting reference number.
 * @param {number} length - The number of consecutive decreasing terms to multiply.
 * @returns {number} The product of `length` consecutive integers starting from `n-1`.
 * @example
 * fallingFactorial(5, 3)  // 24  → (5-1)*(5-2)*(5-3) = 4*3*2
 * fallingFactorial(7, 4)  // 360 → (7-1)*(7-2)*(7-3)*(7-4) = 6*5*4*3
 * fallingFactorial(3, 1)  // 2   → (3-1) = 2
 */
const fallingFactorial = (n, length) => {
  let result = 1;
  for (let i = 1; i <= length; i++) {
    result *= n - i;
  }
  return result;
};
