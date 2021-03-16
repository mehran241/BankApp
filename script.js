'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  containerMovements.innerHTML = '';
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}"> 
          ${i + 1} ${type}</div>
          
          <div class="movements__value">${mov}€</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);

const currDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  // acc.balance = balance;
  labelBalance.textContent = `${acc.balance} EUR`;
};
// currDisplayBalance(account1.movements);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};
// calcDisplaySummary(account1.movements);

const createusername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (word) {
        return word[0];
      })
      .join('');
  });
};

createusername(accounts);
// console.log(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);
  // Display balance
  currDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};

//  Event Handler

let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log(`Login`);

    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //  Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, recieverAccount);
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    recieverAccount &&
    currentAccount.balance >= amount &&
    recieverAccount?.username !== currentAccount.username
  ) {
    console.log(`transfer valid`);
    currentAccount.movements.push(-amount);
    recieverAccount.movements.push(amount);
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add amount to current account
    currentAccount.movements.push(amount);
    // update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    //  Delete account
    accounts.splice(index, 1);
    // Hide account
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  console.log(displayMovements(currentAccount.movements, !sorted));
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/*
const arr = ['a', 'b', 'c', 'd', 'e'];

// slice method
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));

console.log(arr.slice());
console.log([...arr]);

// splice

// console.log(arr.splice(2));
console.log(arr.splice(-1));

console.log(arr.splice(1, 2));
console.log(arr);
*/
// Reverse method
/*
const arr = ['a', 'b', 'c', 'd', 'e'];

const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

//  Concatination
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

console.log(letters.join(' - '));
*/

/*

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const movement of movements) {
  if (movement > 0) {
    console.log(`You deposited ${movement}`);
  } else {
    console.log(`You withdrew ${movement}`);
  }
}

console.log(`-----  forEach -----`);

movements.forEach(function (movement, index) {
  if (movement > 0) {
    console.log(`Movment ${index + 1} :You deposited ${movement}`);
  } else {
    console.log(`Movment ${index + 1} :You withdrew ${movement}`);
  }
});

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (items, index, map) {
  console.log(`${index} : ${items}`);
});

const juliarr = [8, 5, 6, 12, 7];
const checkDogs = function (dogsjulia, dogskate) {
  const correctdogs = juliarr.slice(1, 3);
  const dogs = correctdogs.concat(dogskate);
  console.log(dogs);

  //  dog number 1 is an adult and is 5 years old or a puppy
  dogs.forEach(function (dogs, index) {
    if (dogs >= 3) {
      console.log(
        `dog number ${index + 1} is an adult and is ${dogs} years old `
      );
    } else {
      console.log(`dog ${index + 1} is still a puppy`);
    }
  });
};
checkDogs([8, 5, 6, 12, 7], [14, 1, 15, 18, 13]);
*/
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurotousd = 1.1;

const EurotoUSD = movements.map(function (items) {
  return items * eurotousd;
});

console.log(EurotoUSD);
console.log(movements);

const deposit = movements.filter(function (mov) {
  return mov > 0;
});

console.log(movements);
console.log(deposit);

const withdrawal = movements.filter(function (mov) {
  return mov < 0;
});

console.log(withdrawal);
*/

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const balance = movements.reduce(function (acc, curr, i, arr) {
//   return acc + curr;
// }, 0);

/*
const balance = movements.reduce((acc, curr) => acc + curr);

console.log(balance);

//  some : Conditions
const anyDeposits = movements.some(mov => mov > 0);
console.log(anyDeposits);

//  every : if all the elements in the array pass the conditions

const any23 = account4.movements.every(mov => mov > 0);
console.log(any23);

// separate callback

const deposit = mov => mov > 0;

console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));


const newArr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(newArr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

const calcAccount = accounts.map(acc => acc.movements);
console.log(calcAccount);

const arr = calcAccount.flat();
console.log(arr);

const calcarr = arr.reduce((acc, mov) => mov + acc, 0);
console.log(calcarr);

const overallBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => mov + acc, 0);
console.log(overallBalance);

const overallBalance1 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => mov + acc, 0);
console.log(overallBalance1);

const schol = ['jonas', 'zach', 'martha', 'adam'];
console.log(schol.sort());

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//  Ascending
movements.sort((a, b) => a - b);
console.log(movements);

//  Decending
movements.sort((a, b) => b - a);
console.log(movements);

const Arra = [1, 2, 3, 4, 5, 6, 7];
console.log([1, 2, 3, 4, 5, 6, 7]);
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

const x = new Array(7);
console.log(x);

console.log(Arra.fill(23, 4, 6));

const y = Array.from({ length: 7 }, () => 1);
console.log(y);
const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

const randomNumbers = function (min, max) {
  return Math.random() * (max - min) + min;
};
randomNumbers();
*/
