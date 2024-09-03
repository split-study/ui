export const getNumberFromString = (str: string): number => {
  const match = str.match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[0]) : 0;
};
