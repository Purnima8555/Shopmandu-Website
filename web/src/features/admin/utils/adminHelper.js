

export const formatCurrency = (value = 0) =>
  `Rs.${Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;



/*  Helpers  */
export const CURRENT_YEAR = new Date().getFullYear(); //// get current year
export const CURRENT_MONTH = new Date().getMonth() + 1; /// get current month.

export const YEARS = Array.from(
  { length: CURRENT_YEAR - 2020 + 1 }, //// it just object {length: 7}  which is create 7 array of elementes.
  (_, i) => CURRENT_YEAR - i, /// it is just call back function to generate array (value, index)
  //// calcuation 2026-0 = 2026, 2026-1=2025...
);
// console.log(YEARS)