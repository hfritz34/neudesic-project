document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loan-form');
    form.addEventListener('submit', function(event) {
      event.preventDefault();
  
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
  
      fetch('/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(response => response.json())
      .then(data => {
        displayResults(data);
      })
      .catch(error => console.error('Error:', error));
    });
  });
  function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; 
  
    const table = document.createElement('table');
  
    table.innerHTML = `
    <tr>
      <th>Month</th>
      <th>Principal Amount Remaining</th>
      <th>Interest Amount Paid</th>
      <th>Principal Amount Paid</th>
      <th>Total Monthly Payment</th>
    </tr>`;
        data.amortizationSchedule.forEach(item => {
      const row = table.insertRow();
      row.innerHTML = `
      <td>${item.month}</td>
      <td>${item.balance.toFixed(2)}</td>
      <td>${item.interestPayment.toFixed(2)}</td>
      <td>${item.principalPayment.toFixed(2)}</td>
      <td>${data.monthlyPayment.toFixed(2)}</td>`;
        });
    resultsDiv.appendChild(table);
    
    const summaryDiv = document.getElementById('summary');
  summaryDiv.innerHTML = `
  <table class="summary-table">
  <tr>
    <th>Total of ${data.amortizationSchedule.length} monthly payments</th>
    <td>$${data.totalPayment.toFixed(2)}</td>
  </tr>
  <tr>
    <th>Total interest</th>
    <td>$${data.totalInterest.toFixed(2)}</td>
  </tr>
</table>
`;
  }
  