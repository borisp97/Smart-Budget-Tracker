const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const category = document.getElementById('category');
const filterCategory = document.getElementById('filter-category');
const addSound = document.getElementById('add-sound');
const deleteSound = document.getElementById('delete-sound');



let transactions = (JSON.parse(localStorage.getItem('transactions')) || [])
.filter(t => t && t.text && !isNaN(t.amount) && t.category);


form.addEventListener('submit', function(e) {
    e.preventDefault(); 
  
    if (text.value.trim() === '' || amount.value.trim() === '') {
      alert('Unesi tekst i iznos!');
      return;
    }
  
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value, 
      category: category.value
      
    };
  
    transactions.push(transaction);
    addSound.play();
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();
  
    text.value = '';
    amount.value = '';

  });

  filterCategory.addEventListener('change', () => {
    renderFilteredList(filterCategory.value);
  });
  
  

function generateID() {
    return Math.floor(Math.random() * 1000000);
  }

  function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');
    const categoryIcons = {
      salary: '💰',
      food: '🍔',
      transport: '🚌',
      entertainment: '🎮',
      other: '🔧'
    };
  
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  
    item.innerHTML = `
    ${categoryIcons[transaction.category] || ''} ${transaction.text}
    <span>${sign}$${Math.abs(transaction.amount).toFixed(2)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">×</button>
  `;
    list.appendChild(item);
  }

  function updateValues() {
    if (!transactions.length) {
      balance.innerText = '$0.00';
      income.innerText  = '+$0.00';
      expense.innerText = '-$0.00';
      return;
    }
  
    const amounts = transactions.map(t => t.amount);
  
    const total        = amounts.reduce((acc, val) => acc + val, 0).toFixed(2);
    const incomeTotal  = amounts
                           .filter(val => val > 0)
                           .reduce((acc, val) => acc + val, 0)
                           .toFixed(2);
    const expenseTotal = (
                           amounts
                             .filter(val => val < 0)
                             .reduce((acc, val) => acc + val, 0) * -1
                         ).toFixed(2);
  
    balance.innerText = `$${total}`;
    income.innerText  = `+$${incomeTotal}`;
    expense.innerText = `-$${expenseTotal}`;
  }
  

  function removeTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    deleteSound.play();
    updateLocalStorage();
    init();
  }

  function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }

  function renderFilteredList(catValue) {
    list.innerHTML = '';
  
    const filtered =
      catValue === 'all'
        ? transactions
        : transactions.filter(t => t.category === catValue);
  
    if (!filtered.length) {
      const msg = document.createElement('li');
      msg.innerText = 'No transactions yet.';
      msg.style.color = '#999';
      msg.style.textAlign = 'center';
      list.appendChild(msg);
      return;
    }
  
    filtered.forEach(addTransactionDOM);
  }

  function init() {
    list.innerHTML = '';
    renderFilteredList(filterCategory.value);
    updateValues();
  }


 
  
  init();
  
  
