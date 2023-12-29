const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

//route to serve the main HTML page when the root URL is accessed
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html'); 
});

//post route to handle the loan calculation when the form is submitted
app.post('/calculate', (req, res) => {
  const { principal, interestRate, loanTerm } = req.body;
  const results = calculateAmortization(principal, interestRate, loanTerm);
  res.json(results);
});

//start the server and listen on the port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


//function to calculate the loan amortization schedule
function calculateAmortization(principal, annualRate, termMonths) {
  const monthlyRate = annualRate / 12 / 100;
  const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1); //loan formula



  let balance = principal;
  let totalInterest = 0;
  let amortizationSchedule = [];

  for (let month = 1; month <= termMonths; month++) {
      const interestForMonth = balance * monthlyRate; //calc the interest for the current month
      const principalForMonth = monthlyPayment - interestForMonth; //calc the principal payment for the current month

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

  //return the complete amortization schedule and summary details
  return {
      monthlyPayment: monthlyPayment,
      totalInterest: totalInterest,
      totalPayment: monthlyPayment * termMonths,
      amortizationSchedule: amortizationSchedule
  };
}

