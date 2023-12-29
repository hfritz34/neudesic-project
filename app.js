const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html'); 
});

app.post('/calculate', (req, res) => {
  const { principal, interestRate, loanTerm } = req.body;
  const results = calculateAmortization(principal, interestRate, loanTerm);
  res.json(results);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});



function calculateAmortization(principal, annualRate, termMonths) {
  const monthlyRate = annualRate / 12 / 100;
  const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1); //loan formula

  let balance = principal;
  let totalInterest = 0;
  let amortizationSchedule = [];

  for (let month = 1; month <= termMonths; month++) {
      const interestForMonth = balance * monthlyRate;
      const principalForMonth = monthlyPayment - interestForMonth;
      balance -= principalForMonth;
      totalInterest += interestForMonth;

      amortizationSchedule.push({
          month: month,
          principalPayment: principalForMonth,
          interestPayment: interestForMonth,
          totalInterest: totalInterest,
          balance: balance
      });
  }

  return {
      monthlyPayment: monthlyPayment,
      totalInterest: totalInterest,
      totalPayment: monthlyPayment * termMonths,
      amortizationSchedule: amortizationSchedule
  };
}

