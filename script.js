let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
function renderExpenses(expensesData) {
    const expensesList = document.getElementById('expenseList');
    expensesList.innerHTML = '';

    let totalExpense = 0;

    expensesData.forEach((expense, index) => {
        totalExpense += expense.amount;
        const expenseDiv = document.createElement('div');
        expenseDiv.classList.add('expense');
        expenseDiv.innerHTML = `
            <p>Amount: ${expense.amount}, Date: ${expense.date}, Description: ${expense.description}</p>
            <button onclick="editExpense(${index})">Edit</button>
            <button onclick="deleteExpense(${index})">Delete</button>
        `;
        expensesList.appendChild(expenseDiv);
    });

    document.getElementById('totalExpense').textContent = `Total Expense: ${totalExpense.toFixed(2)} Rs`;

    localStorage.setItem('expenses', JSON.stringify(expensesData));
}

function addExpense() {
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;

    if (isNaN(amount) || amount <= 0 || !date || !description) {
        alert('Please enter valid amount, date, and description.');
        return;
    }

    expenses.push({ amount, date, description });
    renderExpenses(expenses);
}

function editExpense(index) {
    const newAmount = parseFloat(prompt('Enter new amount:'));
    const newDate = prompt('Enter new date:');
    const newDescription = prompt('Enter new description:');

    if (isNaN(newAmount) || newAmount <= 0 || !newDate || !newDescription) {
        alert('Please enter valid amount, date, and description.');
        return;
    }

    expenses[index].amount = newAmount;
    expenses[index].date = newDate;
    expenses[index].description = newDescription;
    renderExpenses(expenses);
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    renderExpenses(expenses);
}

function applyFilters() {
    const minAmount = parseFloat(document.getElementById('minAmount').value);
    const maxAmount = parseFloat(document.getElementById('maxAmount').value);
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);

    const filteredExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return (!minAmount || expense.amount >= minAmount) &&
               (!maxAmount || expense.amount <= maxAmount) &&
               (!isNaN(startDate.getTime()) || expenseDate >= startDate) &&
               (!isNaN(endDate.getTime()) || expenseDate <= endDate);
    });

    renderExpenses(filteredExpenses);
}

function sortExpenses(sortBy) {
    let sortedExpenses = [...expenses];
    if (sortBy === 'amount') {
        sortedExpenses.sort((a, b) => a.amount - b.amount);
    } else if (sortBy === 'date') {
        sortedExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    renderExpenses(sortedExpenses);
}
renderExpenses(expenses);