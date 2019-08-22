// testFunction = ({one, two}) => {
//     console.log(one);
//     console.log(two);
//   }
  
//   let testVariable = {two: "I am second", three: "I am third", four: "I am fourth"};
//   let one = "I am first";

//   testFunction(testVariable);
// // testFunction(one);

// const target = { };

// console.log(target);
// // expected output: Object { }

// const source = { b: 4, c: 5 };
// const source2 = { c: 8, d: 9 };

// const returnedTarget = Object.assign(target, source, source2);

// console.log(target);
// // expected output: Object { a: 1, b: 4, c: 5 }

// console.log(source);
// // expected output: Object { a: 1, b: 4, c: 5 }

// console.log(returnedTarget);
// // expected output: Object { a: 1, b: 4, c: 5 }


addUser({Matt:{name:"Matt"}}, {name:"Nick"});

function addUser(userList, user) {
  // console.log(userList);
  // console.log(user);
  let newList = Object.assign({}, userList)
  console.log("---> newList with just the 'userList' argument added:\n", newList);
  console.log(newList[user.name]);
  newList[user.name] = user;
  console.log(newList[user.name]);
  return console.log(newList);
}