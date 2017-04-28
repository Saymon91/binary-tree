var NULL = [undefined, null];
var MAX_CHILD = 2;
var MIN_CHILD = 1;
var VALUE = 0;
var NOT_FOUND = -1;

var EMPTY_PATH = [];

module.exports = class BynaryTree {
  constructor(options) {
    this.tree = [[null, null, null]];
    this.length = 0;
    this.maxDepth = 0;
    this.minDepth = 0;

    var data = options.data;
    if (options.condition) {
      this.condition = options.condition;
    }

    if (NULL.indexOf(data) === -1 && !Array.isArray(data)) {
      data = [data];
    }

    if (!Array.isArray(data)) {
      return;
    }

    for (var index = 0, length = data.length; index < length; index++) {
      this.add(data[index]);
    }
  }

  condition(parent, node) {
    if (!parent || !node) {
      return NOT_FOUND;
    }
    if (parent[VALUE] === node[VALUE]) {
      return VALUE;
    }
    if (parent[VALUE] > node[VALUE]) {
      return MIN_CHILD;
    }
    return MAX_CHILD;
  }

  add(value) {
    if (NULL.indexOf(value) > -1) {
      return EMPTY_PATH;
    }

    var node = [null, null, null];
    node[VALUE] = value;

    return this.insert([value, null, null]);
  }

  insert(node) {
    var parent = this.tree;
    var index = 0;
    var next;
    var added = false;
    var path = [];
    var depth = 0;
    do {
      parent = parent[index];
      if (parent[VALUE] === null || parent[VALUE] === node[VALUE]) {
        parent[VALUE] = node[VALUE];
      } else {
        index = this.condition(parent, node);
        next = index !== NOT_FOUND;

        if (next && !parent[index]) {
          parent[index] = node;
        }
      }

      if (parent[VALUE] === node[VALUE]) {
        added = true;
        next = false;
        path.push(index);
      }
    } while (next);

    added && this.length++;

    if (depth > this.maxDepth) {
      this.maxDepth = depth;
    }
    if (depth < this.minDepth) {
      this.minDepth = depth;
    }

    return added ? path : EMPTY_PATH;
  }

  find(value) {
    var path = [];
    if (NULL.indexOf(value) > -1) {
      return path;
    }

    var index = 0;
    var step = this.tree;
    var result;

    do {
      path.push(index);
      step = step[index];
      result = step ? step[VALUE] : null;
      if (result !== null) {
        index = value > result ? MAX_CHILD : MIN_CHILD;
      }
    } while (result !== value && result !== null);

    return result === value ? path : EMPTY_PATH;
  }

  get(path) {
    if (NULL.indexOf(path) > NOT_FOUND) {
      return undefined;
    }

    if (!Array.isArray(path)) {
      path = [path];
    }

    var result;
    var index = 0;
    var step = this.tree;
    var pathLength = path.length;

    do {
      step = step[path[index++]];
      result = step ? step[VALUE] : null;
    } while (pathLength > index && result !== null);

    return result === null ? undefined : result;
  }

  max(node) {
    return this.extremum(MAX_CHILD, node || this.tree[0]);
  }

  min(node) {
    return this.extremum(MIN_CHILD, node || this.tree[0]);
  }

  extremum(index, step) {
    step = step || this.tree[0];

    while (step[index] !== null) {
      step = step[index];
    }

    return step[VALUE];
  }

  delete(path) {
    if (!Array.isArray(path)) {
      path = this.find(path);
    }
    if (!path.length) {
      return false;
    }

    var parentDeletingNode = this.tree;
    var deletingNode = this.tree;
    for (var index = 0, length = path.length, parentIndex = length -1; index < length; index++) {
      deletingNode = deletingNode[path[index]];
      if (index < parentIndex) {
        parentDeletingNode = parentDeletingNode[path[index]];
      }
    }

    if (!deletingNode[MAX_CHILD] && !deletingNode[MIN_CHILD]) {
      parentDeletingNode[deletingNode[VALUE] > parentDeletingNode[VALUE] ? MAX_CHILD : MIN_CHILD] = null;
      return true;
    }

    if (!deletingNode[MAX_CHILD] && deletingNode[MIN_CHILD]) {
      parentDeletingNode[deletingNode[VALUE] > parentDeletingNode[VALUE] ? MAX_CHILD : MIN_CHILD] = deletingNode[MIN_CHILD];
      return true;
    }


    var maxChild = this.max(deletingNode);
    this.delete(maxChild);
    deletingNode[VALUE] = maxChild;

    return true;
  }
};

