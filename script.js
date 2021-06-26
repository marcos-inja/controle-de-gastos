const transactionUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expanceDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')
const smallVisiblity = document.getElementsByClassName('hidden')

const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))
let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : [] 

const removeTransaction = ID => {
    transactions = transactions.filter(transaction =>
         transaction.id !== ID)
    updateLocalStorage()
    init()
}

const addTransactionIntoDOM = transaction =>{
    const operator = transaction.amount < 0 ? '-': '+'
    const CSSClass = transaction.amount < 0? 'minus' : 'plus'
    const amountWithoutOperator = Math.abs(transaction.amount)
    const li = document.createElement('li')

    li.classList.add(CSSClass)
    li.innerHTML = `
    </li class="minus">
        ${transaction.name} 
        <span>${operator} R$ ${amountWithoutOperator}</span>
        <button class="delete-btn" onClick="removeTransaction(${transaction.id})">
            <i class="uil uil-multiply"></i>
        </button>
    </li>`
    transactionUl.append(li)
}

const getExpanses = transactionsAmounts => Math.abs(transactionsAmounts
    .filter(item => item < 0)
    .reduce((accumulator, value) => accumulator + value,0))
    .toFixed(2)
const getIncome = transactionsAmounts => transactionsAmounts
    .filter(item => item > 0)
    .reduce((accumulator, value) => accumulator + value,0)
    .toFixed(2)
const getTotal = transactionsAmounts => transactionsAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2)

const updateBalanceValues = () => {
    /* pode ser feito asssim: 
     * const transactionsAmounts = transactions.map(({amount}) => amount)
     */
    const transactionsAmounts = transactions
        .map(transaction => transaction.amount)
    const total = getTotal(transactionsAmounts)
    const income = getIncome(transactionsAmounts)
    const expance = getExpanses(transactionsAmounts)

    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expanceDisplay.textContent = `R$ ${expance}`
} 

const init = () => {
    transactionUl.innerHTML = ''
    transactions.forEach(addTransactionIntoDOM)
    updateBalanceValues()
}

init()

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 100000)

const addTransactionArray = (transactionName, transactionAmount) => {
    transactions.push({
        id: generateID(),
        name: transactionName, 
        amount: Number(transactionAmount)
    })
}

const cleanInputs =() => {
    inputTransactionName.value = ''
    inputTransactionAmount.value = ''
}

const handleFormSubmit = event => {
    event.preventDefault()

    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim()
    const isSomeInputEmpy = transactionName === '' && transactionAmount === ''
    const isNameinputEmpy = transactionName === ''
    const isAmountInputEmpy = transactionAmount === ''

    if(isSomeInputEmpy){
        smallVisiblity[0].classList.add('visible')
        smallVisiblity[1].classList.add('visible')
        return
    }
    if(isNameinputEmpy){
        smallVisiblity[0].classList.add('visible')
        return
    }
    if(isAmountInputEmpy){
        smallVisiblity[1].classList.add('visible')
        return
    }

    smallVisiblity[0].classList.remove('visible')
    smallVisiblity[1].classList.remove('visible')

    addTransactionArray(transactionName,transactionAmount)
    init()
    updateLocalStorage()
    cleanInputs()
}

form.addEventListener('submit', handleFormSubmit)
 