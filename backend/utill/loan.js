(function(global) {
  // Sample Calculators:
  // http://www.pine-grove.com/Web%20Calculators/interest.htm

  var startingBalance = 10000.00,
    totalBalance = startingBalance,
    apr = (17.5 / 100),
    months = 11,
    interest,
    customMonthlyPayment = 1000,
    monthlyPayment,
    period;

  console.log('Starting Balance: $' + startingBalance.toFixed(2));
  console.log('APR: ' + apr);

  function getTotalBalance(balance, apr, months) {
    // Compute our total balance which is the starting balance + interest.
    // http://www.math.com/tables/general/interest.htm
    // http://en.wikipedia.org/wiki/Compound_interest#Compound
    return balance * Math.pow(1 + (apr / 360), 360 * (months / 12));
  }

  function getMonthlyPayment(balance, apr, months) {
    // Get our monthly payment calculated by amortization (daily compounded).
    // http://www.vertex42.com/ExcelArticles/amortization-calculation.html
    // http://en.wikipedia.org/wiki/Amortization_calculator

    // We first need to figure out our monthly compounded payment rate.
    var r = Math.pow(1 + (apr / 360), (360 / 12)) - 1;

    // Now we can use our monthly rate to figure out our monthly payment.
    return balance * ((r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
  }

  function getPaymentPeriod(balance, apr, payment) {
    var i = 0, fixedPayment = payment.toFixed(2),
      totalBalance;

    // Determine how many payments will be needed for the specified balance,
    // APR and payment.  We want to stop our while loop once we've made more
    // than 360 monthly payments (30 years).
    while (balance > 0 && i < 360) {
      // The line below first calculates the amount of interest (daily compounded)
      // on the current balance.  Then we subtract the current balance from
      // the current balance with interest for the monthly payment.  That result
      // gives us the total amount of interest for the month.  We then subtract
      // that value from the payment to come up with our principal.  We subtract
      // our principal from our current balance.
      totalBalance = balance * Math.pow(1 + (apr / 360), 30);

      // Since we are manually going through the amortization schedule, our
      // last payment will be very close to our remaining total balance.
      // If that's the case, we will simply want to only subtract the remaining
      // payment, if not, then continue to subtract the principal from the
      // remaining balance.
      if (fixedPayment === totalBalance.toFixed(2)) {
        balance -= payment;
      } else {
        balance -= payment - (totalBalance - balance);
      }

      i++;
    }

    return i;
  }

  // Get our total balance
  totalBalance = getTotalBalance(startingBalance, apr, months);
  // Determine our total interest during the time period.
  interest = totalBalance - startingBalance;
  // Get our monthly payment
  monthlyPayment = getMonthlyPayment(startingBalance, apr, months);

  console.log('----------------------------------------------------------');
  console.log('Months: ' + months);
  console.log('Total Interest Paid: $' + interest.toFixed(2));
  console.log('Total Balance (starting + interest): $' + totalBalance.toFixed(2));
  console.log('Monthly Payment: $' + monthlyPayment.toFixed(2));
  console.log('----------------------------------------------------------');

  period = getPaymentPeriod(startingBalance, apr, monthlyPayment);
  totalBalance = getTotalBalance(startingBalance, apr, period);
  interest = totalBalance - startingBalance;

  console.log('Total Interest Paid: $' + interest.toFixed(2));
  console.log('Total Balance (starting + interest): $' + totalBalance.toFixed(2));
  console.log('Number of calculated monthly payments: ' + period);
})(this);
