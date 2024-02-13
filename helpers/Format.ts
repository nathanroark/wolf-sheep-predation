//------------------------------------------------------------------------------
// Author:  Nathan Roark
// School:  The University of Alabama in Huntsville
// Program: Lionfish Culling (Program 2)
// Course:  CS 582, Modeling and Simulation 2
// Date:    22 February 2023
//------------------------------------------------------------------------------

/**
 * SetW
 * - function to assist with pretty printing
 *
 * @param s string to pad
 * @param width amount to pad the string to
 * @returns the given string with padding applied
 */
export const setw = (s: string, width: number): string => {
  let padding = "";
  if (s.length < width) padding = " ".repeat(width - s.length);
  return padding + s;
};

/**
 * Spaces
 * - create a number of spaces
 *
 * @param n - number of spaces to create
 * @returns a string of spaces
 */
const spaces = (n: number) => {
  let spaces_string = "";
  for (let i = 0; i < n; i++) {
    spaces_string += " ";
  }
  return spaces_string;
};

/**
 * Format Number
 * - format a number and return it as a string
 *
 * @param x - number to format
 * @param left - spaces to add in front
 * @param right - spaces to add behind number
 * @returns - a string of a format number
 */
export const format_nbr = (x: number, left: number, right?: number) => {
  let width_adjusted_value: string = setw(x.toString(), left);
  if (right) width_adjusted_value.concat(width_adjusted_value, spaces(right));
  return width_adjusted_value;
};
