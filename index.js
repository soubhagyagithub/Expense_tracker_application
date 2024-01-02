function handleFormSubmit(event) {
    event.preventDefault();

    const category = event.target['category-select'].value;
    const amount = event.target['amount-input'].value;
    const date = event.target['date-input'].value;

    if (!category || isNaN(amount) || amount <= 0 || !date) {
        alert('Please fill in all the fields with valid information.');
        return;
    }

    const expenseDetails = {
        category: category,
        amount: Number(amount),
        date: date,
    };

    const tableBody = document.getElementById('expense-table-body');
    const totalAmountCell = document.getElementById('total-amount');

    let totalAmount = 0;
    let editedExpenseIndex = -1;

    for (let i = 0; i < tableBody.rows.length; i++) {
        const row = tableBody.rows[i];

        // Check if the row is being edited
        if (row.classList.contains('editing')) {
            editedExpenseIndex = i;

            // Updating the edited row with the new expense details
            row.cells[0].textContent = expenseDetails.category;
            row.cells[1].textContent = expenseDetails.amount;
            row.cells[2].textContent = expenseDetails.date;

            // Remove the editing class
            row.classList.remove('editing');

            // Update the local storage entry for the edited expense
            const editedExpenseKey = row.getAttribute('data-expense-key');
            localStorage.setItem(editedExpenseKey, JSON.stringify(expenseDetails));
        }

        totalAmount += parseFloat(row.cells[1].textContent);
    }

    // If not editing, adding a new row
    if (editedExpenseIndex === -1) {
        const newRow = tableBody.insertRow();
        const categoryCell = newRow.insertCell(0);
        const amountCell = newRow.insertCell(1);
        const dateCell = newRow.insertCell(2);
        const deleteCell = newRow.insertCell(3);
        const editCell = newRow.insertCell(4);

        categoryCell.textContent = expenseDetails.category;
        amountCell.textContent = expenseDetails.amount;
        dateCell.textContent = expenseDetails.date;

        // Deleting the button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
        deleteButton.onclick = () => {
            const expenseKey = newRow.getAttribute('data-expense-key');
            const deletedAmount = parseFloat(newRow.cells[1].textContent);

            localStorage.removeItem(expenseKey);
            tableBody.removeChild(newRow);

            // Updating total amount when deleting an expense
            totalAmount -= deletedAmount;
            totalAmountCell.textContent = totalAmount.toFixed(2);
        };
        deleteCell.appendChild(deleteButton);

        // Editing button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('btn', 'btn-warning', 'btn-sm');
        editButton.onclick = () => {
            // Setting the form values to the selected expense for editing
            document.getElementById('category-select').value = expenseDetails.category;
            document.getElementById('amount-input').value = expenseDetails.amount;
            document.getElementById('date-input').value = expenseDetails.date;

            // Adding editing class to the row
            newRow.classList.add('editing');
        };
        editCell.appendChild(editButton);

        // Saving the new expense to local storage and assign a unique key
        const newExpenseKey = `${category}-${Date.now()}`;
        newRow.setAttribute('data-expense-key', newExpenseKey);
        localStorage.setItem(newExpenseKey, JSON.stringify(expenseDetails));

        // Updating the total amount when adding a new expense
        totalAmount += parseFloat(expenseDetails.amount);
    }

    // Updating total amount
    totalAmountCell.textContent = totalAmount.toFixed(2);

    // Clearing the form
    event.target.reset();
}


