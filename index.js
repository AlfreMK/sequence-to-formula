const factorial = (num) => {
  let rval = 1;
  for (let i = 2; i <= num; i++) rval = rval * i;
  return rval;
};

// product = (n-1)*(n-2)...*(n-len)
const product = (n, len) =>
  Array.from({ length: len }, (_, i) => n - i).reduce((a, b) => a * b, 1);

const b_n2 = (a1, a2) => (n) => {
  return ((a2 - a1) * product(n, 1)) / factorial(1) + a1;
};

const b_n3 = (a1, a2, a3) => (n) => {
  return (
    ((a3 - b_n2(a1, a2)(n)) * product(n, 2)) / factorial(2) + b_n2(a1, a2)(n)
  );
};

// inspired from "Derivando" youtube's video:
// https://youtu.be/YghBJcxkhPY
const b_n =
  (...args) =>
  (n) => {
    let result = args[0];
    for (let i = 1; i < args.length; i++) {
      result = ((args[i] - result) * product(n, i)) / factorial(i) + result;
    }
    return result;
  };

class Succession {
  constructor(...args) {
    this.args = args;
    this.b_numbers = new Array(args.length);
    this.b_n(...args)(args.length);
  }

  b_n =
    (...args) =>
    (n) => {
      n = n - 1;
      this.b_numbers[0] = args[0];
      for (let i = 1; i < args.length; i++) {
        this.b_numbers[i] =
          ((args[i] - this.b_numbers[i - 1]) * product(n, i)) / factorial(i) +
          this.b_numbers[i - 1];
      }
      return this.b_numbers[this.b_numbers.length - 1];
    };

  getValueByN = (i) => this.b_n(...this.args)(i);

  printPolynomialFunction() {
    let args = this.args;
    let b_numbers = this.b_numbers;
    let pattern = " f(n) = ";
    for (let k = args.length; k > 1; k--) {
      let term = "";
      for (let i = k-1; i >= 1; i--) {
        term += `(n-${k - i})`;
      }
      term += `/${k-1}!`;

      pattern += `(${args[k - 1]} - ${b_numbers[k - 2]})${term}`;
      if (k > 1) {
        pattern += " + ";
      }
    }
    pattern += `${args[0]}`;
    console.log(pattern);
    return pattern;
  }

  printInLatex() {
    let args = this.args;
    let b_numbers = this.b_numbers;
    let pattern = " f(n) = ";
    for (let k = args.length; k > 1; k--) {
        let term = `\\frac{\\displaystyle\\prod_{k=1}^{${k-1}} (n - k)}{${k-1}!}`
      pattern += `(${args[k - 1]} - ${b_numbers[k - 2]})${term}`;
      if (k > 1) {
        pattern += "\\\\ + ";
      }
    }
    pattern += `${args[0]}`;
    console.log(pattern);
    return pattern;
  }
}


// const test = new Succession(20, 10, 100);

// test.printInLatex();
