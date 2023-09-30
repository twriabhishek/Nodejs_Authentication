const randompercent = () => {
  // Generate a random decimal number between 0 and 1
  const randomDecimal = Math.random();

  // Convert the decimal number to a random percentage between 0 and 100
  const randomPercentage = ~~(randomDecimal * 100);

  console.log(`Random Percentage: ${randomPercentage}%`);
};

export default randompercent;