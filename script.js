let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

function renderExpenses(expensesToDisplay) {
    const list = document.getElementById('expenseList');
    list.innerHTML = '';
    let total = 0;

    expensesToDisplay.forEach((item, index) => {
        total += item.amount;
        const div = document.createElement('div');
        div.className = 'expense';
        div.innerHTML = `
            <div class="expense-info">
                <h4>${item.description}</h4>
                <p>₹${item.amount.toFixed(2)} • ${item.date}</p>
            </div>
            <div class="actions">
                <button class="btn-outline" onclick="editExpense(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteExpense(${index})">Delete</button>
            </div>
        `;
        list.appendChild(div);
    });

    document.getElementById('totalExpense').textContent = `Total: ₹${total.toFixed(2)}`;
}

// Logic Fix: Only save the MASTER list, never the filtered list
function saveToStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function addExpense() {
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;

    if (!amount || !date || !description) return alert("Fill all fields!");

    expenses.push({ amount, date, description });
    saveToStorage(); // Save master list
    renderExpenses(expenses);
    
    // Clear inputs
    document.getElementById('amount').value = '';
    document.getElementById('description').value = '';
}

function deleteExpense(index) {
    if(confirm("Delete this expense?")) {
        expenses.splice(index, 1);
        saveToStorage();
        renderExpenses(expenses);
    }
}

function applyFilters() {
    const min = parseFloat(document.getElementById('minAmount').value);
    const max = parseFloat(document.getElementById('maxAmount').value);
    const start = new Date(document.getElementById('startDate').value);
    const end = new Date(document.getElementById('endDate').value);

    const filtered = expenses.filter(exp => {
        const d = new Date(exp.date);
        const matchesAmount = (!min || exp.amount >= min) && (!max || exp.amount <= max);
        // Fix: Use isNaN check correctly to ignore empty dates
        const matchesDate = (isNaN(start.getTime()) || d >= start) && 
                            (isNaN(end.getTime()) || d <= end);
        return matchesAmount && matchesDate;
    });

    renderExpenses(filtered);
}

function sortExpenses(key) {
    if (key === 'amount') {
        expenses.sort((a, b) => b.amount - a.amount); // Higher first
    } else {
        expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    saveToStorage();
    renderExpenses(expenses);
}
renderExpenses(expenses);