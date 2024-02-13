//------------------------------------------------------------------------------
// Author:  Nathan Roark
// School:  The University of Alabama in Huntsville
// Program: Wolf-Sheep Predation (Program 3)
// Course:  CS 582, Modeling and Simulation 2
// Date:    06 March 2023
//------------------------------------------------------------------------------

/**
 * Mean
 * - find the average of a given array of numbers
 * @param array - array of numbers to find the average of
 * @returns - the average
 */
export const mean = (array: number[]) =>
  array.reduce((a, b) => a + b) / array.length;

/**
 * Standard Deviation
 * - find the standard deviation of a given array of numbers
 *
 * @param array - array of numbers to find the standard deviation of
 * @returns - the standard deviation
 */
export const stdDev = (array: number[]) => {
  if (!array || array.length === 0) return 0;
  const n = array.length;
  const mean = array.reduce((a, b) => a + b) / n;
  return Math.sqrt(
    array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
  );
};

/**
 * Confidence Interval Low
 * - low end of the confidence interval
 * @param array - data set to get the confidence interval of
 * @param z - confidence level to find the interval of, default set to 95%
 * @returns - low end of the confidence interval
 */ export const ci_low = (array: number[], z: number = 0.95) => {
  return mean(array) - z * (stdDev(array) / Math.sqrt(array.length));
};

/**
 * Confidence Interval High
 * - high end of the confidence interval
 * @param array - data set to get the confidence interval of
 * @param z - confidence level to find the interval of, default set to 95%
 * @returns - high end of the confidence interval
 */
export const ci_high = (array: number[], z: number = 0.95) => {
  return mean(array) + z * (stdDev(array) / Math.sqrt(array.length));
};

/**
 * Confidence Interval
 * - Find confidence interval of a given data set
 *
 * @param array - data set to get the confidence interval of
 * @param z - confidence level to find the interval of, default set to 95%
 * @returns {low: number, high: number} - low end and high end of confidence interval
 */
export const confidenceInterval = (array: number[], z: number = 0.95) => {
  return { low: ci_low(array, z), high: ci_high(array, z) };
};

/**
 * Random Uniform Generator
 *
 * - Randomly generate an array of numbers
 *
 * @param quantity - amount of numbers to generate
 * @param min - the minimum number that can be generated
 * @param max - the maximum number that can be generated
 *
 * @returns - array of uniformly random numbers
 */
export const runif = (quantity: number, min: number, max: number) => {
  const array = new Array<number>();

  while (array.length < quantity) {
    array.push(Math.floor(Math.random() * (max - min + 1) + min));
  }
  return array;
};

/**
 * Sample
 * - takes a sample of the specified size from the elements of x using either with or without replacement.
 *
 * @param x - either a vector of one or more elements from which to choose, or a positive integer. See ‘Details.’
 * @param size - a non-negative integer giving the number of items to choose.
 * @param replace - should sampling be with replacement?
 *
 * @returns - a vector of length size with elements drawn from either x or from the integers 1:x.
 */
export const sample = (
  x: number | Array<number>,
  size?: number,
  replace: boolean = false
): number[] => {
  if (Array.isArray(x)) {
    if (size == undefined) size = x.length;
    var shuffled = x.slice(0),
      i = x.length,
      min = i - size,
      temp,
      index;
    while (i-- > min) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    return shuffled.slice(min);
  }
  if (size == undefined) size = x;
  if (replace == true) {
    const array = new Array();
    while (array.length < x) {
      array.push(Math.floor(Math.random() * x) + 1);
    }
    return array;
  }
  const array = new Array();
  while (array.length < x) {
    let r = Math.floor(Math.random() * x) + 1;
    while (array.includes(r)) {
      // console.log("Array already has: " + r + " getting new num")
      r = Math.floor(Math.random() * x) + 1;
    }
    array.push(r);
    // console.log("Added: " + array.length + " element to set")
  }
  return array;
};
