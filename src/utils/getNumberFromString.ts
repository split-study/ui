export const getNumberFromString = (str: string): number => {
  const numberString = str.match(/[\d.,]+/)![0];

  const formattedNumber = numberString.replace(/,/g, '');

  return +formattedNumber;
};
