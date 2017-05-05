var Tree = require('./index.js');

function runTime(callback) {
  var start = process.hrtime();
  callback();
  var stop = process.hrtime(start);
  return stop[0] * 1e9 + stop[1];
}

function compare(func1, func2) {
  return runTime(func1) - runTime(func2);
}

var arr = [10, 99, 18, 7, 16, 5, 8, 11, 2, 1];

function del(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }

  return true;
}


function delWhile(arr, value) {
  var index = -1;
  var found = false;
  var length = arr.length;
   do {
     found = value === arr[++index];
   } while (!found && index < length);

  if (found) {
    arr.splice(index, 1);
  }

  return true;
}

var testArr;
var testTree;
console.log('CREATION1:', compare(
  function () {
    return (testArr = [10, 99, 18, 7, 16, 5, 8, 11, 2, 1]);
  },
  function () {
    return (testTree = new Tree({ data: [10, 99, 18, 7, 16, 5, 8, 11, 2, 1] }));
  }));

console.log('CREATION2:', compare(
  function () {
    return (testArr = [10, 99, 18, 7, 16, 5, 8, 11, 2, 1]);
  },
  function () {
    return (testTree = new Tree({ data: [10, 99, 18, 7, 16, 5, 8, 11, 2, 1] }));
  }));

console.log('CREATION3:', compare(
  function () {
    return (testArr = [10, 99, 18, 7, 16, 5, 8, 11, 2, 1]);
  },
  function () {
    return (testTree = new Tree({ data: [10, 99, 18, 7, 16, 5, 8, 11, 2, 1] }));
  }));


console.log('ADD1:', compare(
  function () {
    return testArr.push(100);
  },
  function () {
    return testTree.add(100);
  }));

console.log('ADD2:', compare(
  function () {
    return testArr.push(101);
  },
  function () {
    return testTree.add(101);
  }));

console.log('ADD3:', compare(
  function () {
    return testArr.push(102);
  },
  function () {
    return testTree.add(102);
  }));

console.log('DELETE1:', compare(
  function () {
    return del(testArr, 100);
  },
  function () {
    return testTree.delete(100);
  }));

console.log('DELETE2:', compare(
  function () {
    return del(testArr, 101);
  },
  function () {
    return testTree.delete(101);
  }));

console.log('DELETE3:', compare(
  function () {
    return del(testArr, 102);
  },
  function () {
    return testTree.delete(102);
  }));

console.log('DELETE4:', compare(
  function () {
    return del(testArr, 18);
  },
  function () {
    return testTree.delete(18);
  }));
console.log('DELETE5:', compare(
  function () {
    return del(testArr, 10);
  },
  function () {
    return testTree.delete(10);
  }));

testTree.add(100);
testArr.push(100);
testTree.add(101);
testArr.push(101);
testTree.add(102);
testArr.push(102);
testTree.add(10);
testArr.push(10);
testTree.add(18);
testArr.push(18);

console.log('DELETE_1:', compare(
  function () {
    return delWhile(testArr, 100);
  },
  function () {
    return testTree.delete(100);
  }));

console.log('DELETE_2:', compare(
  function () {
    return delWhile(testArr, 101);
  },
  function () {
    return testTree.delete(101);
  }));

console.log('DELETE_3:', compare(
  function () {
    return delWhile(testArr, 102);
  },
  function () {
    return testTree.delete(102);
  }));

console.log('DELETE_4:', compare(
  function () {
    return delWhile(testArr, 10);
  },
  function () {
    return testTree.delete(10);
  }));

console.log('DELETE_5:', compare(
  function () {
    return delWhile(testArr, 18);
  },
  function () {
    return testTree.delete(18);
  }));