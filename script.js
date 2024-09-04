'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Nehal Shaikh',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 2463,
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
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${acc.balance} €`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€ `;

  const outgoing = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outgoing)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€ `;
};

const createUserName = function (accs) {
  accounts.forEach(function (acc) {
    acc.userName = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};
createUserName(accounts);

const updateUI = function (acc) {
  //display movements
  displayMovements(acc.movements);

  // display balance
  calcDisplayBalance(acc);

  // display summary
  calcDisplaySummary(acc);
};

// Event Handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // prevent form from submitting
  e.preventDefault();

  // console.log('login');

  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  // console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // display UI and message

    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
  }
  // clear the input field
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();

  // update UI
  updateUI(currentAccount);
});

// updateUI(currentAccount);

// transfor of money

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.userName !== currentAccount.userName
  ) {
    // doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
  }
  // update UI
  updateUI(currentAccount);
});

// Loan feature
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // add movement
    currentAccount.movements.push(amount);

    // update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

// account close

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    console.log(index);

    accounts.splice(index, 1);

    // hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

// sort button

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd', 'e'];

// // slice method
// // console.log(arr.slice(2));

// // splice method

// // arr.splice(1, 3);
// // arr.splice(-1);
// // console.log(arr);

// // Reverse method
// let arr2 = ['i', 'j', 'h', 'g', 'f'];

// // console.log(arr2.reverse());
// // console.log(arr2)

// // Concat

// const letters = arr.concat(arr2);
// // console.log(letters);
// // console.log([...arr, ...arr2]);

// // Join Method

// console.log(letters.join('  '));

// At method

// const arr= [23, 15, 10];
// console.log(arr[0]);
// console.log(arr.at(0));

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
//   if (movement > 0) {
//     console.log(`You have deposited ${movement}`);
//   } else {
//     console.log(`You have withdrawn ${Math.abs(movement)}`);
//   }
// }

// movements.forEach(function (movement) {
//   if (movement > 0) {
//     console.log(`You have deposited ${movement}`);
//   } else {
//     console.log(`You have withdrawn ${Math.abs(movement)}`);
//   }
// });

// forEeach with Map
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// })

// // forEach with set

// const currenciesunique = new Set(['Euro', 'Euro', 'USD', 'IND']);
// currenciesunique.forEach(function (value, _values, set) {
//   console.log(`${_values}: ${value}`);
// })

// MAP method-

// const euroToUsd = 1.1;

// const movementUSD = movements.map(mov => mov * euroToUsd);
// console.log(movements);
// console.log(movementUSD)

// const movementsDescription = movements.map((mov, i, arr) => {
//    if (mov > 0) {
//      return console.log(`You have deposited ${mov}`);
//    } else {
//      return console.log(`You have withdrawn ${Math.abs(mov)}`);
//    }
//  });
// console.log(movementsDescription);

// FILTER method

// const deposits = movements.filter((e) => e > 0);
// console.log(deposits);

// console.log(movements);

// const depositArr = [];
// for (const depo of movements) {
//   if (depo > 0) {
//     depositArr.push(depo)
//   };
// }
// console.log(depositArr);

// const withdrawals = movements.filter((mov) => mov < 0);
// console.log(withdrawals);

// const withdrawalArr = [];
// for (const e of movements){
//   if (e < 0) {
//     withdrawalArr.push(e);
//   }
// }
// console.log(withdrawalArr)

// REDUCE method

// console.log(movements);
// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`iteration number ${i}, this is ${acc}`);
//   return acc + cur;
// }
//   , 0);
// console.log(balance);

// let balance2 = 0;
// for (const mov2 of movements) balance2 += mov2;

// console.log(balance);

// Maximum value using reduce

// const maximumValue = movements.reduce(function(acc, curr){
//   if (acc > curr) {
//     return acc;
//   } else { return curr }
// }, movements[0]);

// console.log(maximumValue);

// Chaining multiple methods together

// const euroToUsd = 1.1;
// console.log(movements);

// const totalDepositUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * euroToUsd)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositUSD);

// coding challenge #3

// const calcAgeHumanAge = ages =>
//   ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, age,i, arr) => acc + age / arr.length, 0);

// const avg1 = calcAgeHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const avg2 = calcAgeHumanAge([16, 6, 10, 5, 6, 1, 4]);

// console.log(avg1, avg2);

// FIND method

// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);

// console.log(accounts);
// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// some method

// console.log(movements);
// console.log(movements.includes(-130));

// const anyDeposit = movements.some(mov => mov > 0);
// console.log(anyDeposit);

// // every method

// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// // seperate callback

// const deposit = mov => mov > 0;
// console.log(movements.some(deposit))

// flat method

// let arr = [1, [2, 3], 4, [5, 6, 7]];
// console.log(arr.flat());

// const overAllBalance = accounts
//   .flatMap(acc => acc.movements) // flatMap method in action
//   .reduce((acc, curr) => acc + curr, 0);

// console.log(overAllBalance);

// SORTING Arrays

// with strings
// const owners = ['Jonas', 'Zack', 'Adam', 'Martha'];
// console.log(owners.sort());

// // with numbers

// console.log(movements);
// movements.sort();
// console.log(movements);

// fill method

// let x = new Array(7);
// console.log(x);

// x.fill(1, 2, 4);
// console.log(x);

// // Array from

// const diceRoll = Array.from({ length: 100 }, (e, i) => i + 1);
// // console.log(diceRoll);

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('€', ''))
//   );
//   console.log(movementsUI);

//   const movementsUI2 = [...document.querySelectorAll('.movements__value')];
// });

// const num = [1, 2, 3, 4];
// const double = Array.from(num, e => e * 2);
// console.log(double);

// array method practice

// 1. 
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((acc, curr) => acc + curr, 0);
console.log(bankDepositSum);

// 2.
const numDeposits1000 = accounts.flatMap(acc => acc.movements).filter(mov => mov >= 1000).length;
console.log(numDeposits1000);

