var NULL = [undefined, null];

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

    if (NULL.indexOf(data) >= 0 && !Array.isArray(data)) {
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
      return -1;
    } else if (parent[1] === node[1]) {
      return 1;
    } else if (parent[1] > node[1]) {
      return 0;
    } else {
      return 2;
    }
  }

  add(value) {
    return NULL.indexOf(value) > -1
      ? this
      : this.insert([null, value, null]);
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
      path.push(index);
      if (parent[1] === null) {
        parent[1] = node[1];
        added = true;
        next = false;
      } else {
        index = this.condition(parent, node);
        next = index !== 1 && index !== -1;

        if (!next) {
          parent[index] = [null, null, null];
        }
      }
    } while (next);

    added && this.length++;

    if (depth > this.maxDepth) {
      this.maxDepth = depth;
    }
    if (depth < this.minDepth) {
      this.minDepth = depth;
    }

    return added ? path : [];
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
      result = step ? step[1] : null;
      if (result !== null) {
        index = value > result ? 2 : 0;
      }
    } while (result !== value && result !== null);

    return result === value ? path : [];
  }

  get(path) {
    if (NULL.indexOf(path) > -1) {
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
      result = step ? step[1] : null;
    } while (pathLength > index && result !== null);

    return result === null ? undefined : result;
  }

  max(node) {
    return this.extremum(2, node || this.tree[0]);
  }

  min(node) {
    return this.extremum(0, node || this.tree[0]);
  }

  extremum(index, step) {
    step = step || this.tree[0];

    while (step[index] !== null) {
      step = step[index];
    }

    return step[1];
  }

  delete(path) {
    if (!Array.isArray(path)) {
      path = this.find(path);
    }
    if (!path.length) {
      return false;
    }

    var parentDeletingNode;
    var deletingNode = this.tree;
    for (var index = 0, length = path.length; index < length; index++) {
      deletingNode = deletingNode[path[index]];
    }
  }
};

