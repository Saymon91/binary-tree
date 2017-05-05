class Node {
  constructor(options) {
    options = {};
    this.path = [];
    this.value = undefined;
    this.type = null;
    this.left = null;
    this.right = null;

    for (var index in options) {
      this[index] = options[index] instanceof Function
        ? options[index].bind(this)
        : options[index];
    }

    if (this.type && Array.isArray(this.path)) {
      this.path.push(this.type);
    }
  }

  setPath(parentPath) {
    this.path = parentPath.concat(this.type);
    return this;
  }

  setType(type) {
    this.type = type;
    this.path[this.path.length - 1] = this.type;
    return this;
  }

  addChildren(node) {
    if (!node.type) {
      node.setType(this.compare(this, node.value));
    }
    if (node.type === 'value') {
      return this.path;
    }
    if (this[node.type]) {
      return [];
    }
    this[node.type] = node;
    return node.path;
  }

  compare(parent, value) {
    if (parent.value > this.value) {
      return 'right';
    }
    if (parent.value < this.value) {
      return 'left';
    }
    if (parent.value === this.value) {
      return 'value';
    }

    return null;
  }
}


class Tree {
  constructor(options) {
    options = options || {};
    this.nodes = [];
    this.root = null;
    this.history = {};

    if (Array.isArray(options.data)) {
      var data = options.data;
      for (var index = 0, length = data.length; index < length; index++) {
        this.insert(data[index]);
      }
    }

    if (options.compare instanceof Function) {
      this.compare = options.compare;
    }
  }

  insert(value) {
    var cache = this.history[value];
    if (cache) {
      return cache.path
    }

    var parent = this.root;

    if (!parent) {
      this.root = new Node({ value, type: 'root', compare: this.compare });
      this.history[value] = this.root;
      return this.root.path;
    }

    var nodeType;

    do {
      if (nodeType) {
        parent = parent[nodeType];
      }
      nodeType = this.compare(parent, value);
    }
    while (nodeType && nodeType !== 'value' && parent[nodeType]);

    if (!nodeType) {
      return [];
    }

    if (nodeType === 'value') {
      return parent.path;
    }

    var node = new Node({ value, type: nodeType, path: parent.path });
    this.history[value] = node;
    return parent.addChildren(node);
  }

  find(value, parentNode) {
    if (!parentNode && value in this.history) {
      return this.history[value];
    }

    var parent = parentNode || this.root;
    var childType = this.compare(parent, value);
    if (childType === 'value') {
      this.history[value] = parent;
      return parent;
    }

    do {
      parent = childType ? parent[childType] : null;
      if (parent) {
        childType = parent.compare(parent.value);
      }
    } while (parent && childType !== 'value');

    if (!parentNode) {
      this.history[value] = parent;
    }

    return parent;
  }

  delete(value, parentNode) {
    var deletingNode = this.find(value);
    if (!deletingNode) {
      return false;
    }

    this.history = {};

    var left = deletingNode.left;
    var right = deletingNode.right;
    parentNode = parentNode || this.getNode(deletingNode.path.slice(0, deletingNode.path - 1)) || this;

    if (!left && !right) {
      parentNode[deletingNode.type] = null;
      return true;
    }

    if (!left && right) {
      parentNode[deletingNode.type] = right;
      return true;
    }

    if (left && !right) {
      parentNode[deletingNode.type] = left;
      return true;
    }

    if (left && right && !right.left) {
      right.addChildren(left);
      parentNode[deletingNode.type] = right;
      return true;
    }

    if (left && right && right.left) {
      var minRight = this.min(right);
      deletingNode.value = minRight.value;
      return this.delete(minRight.value, this.getNode(minRight.path.slice(0, minRight.path.length - 1)));
    }
  }

  getNode(path) {
    if (!Array.isArray(path) || !path.length) {
      return null;
    }

    var node = this;
    var index = 0;
    var length = path.length;
    while (node && index < length) {
      node = node[path[index++]];
    }

    return node;
  }

  max(node) {
    return this.extremum('right', node || this.root);
  }

  min(node) {
    return this.extremum('left', node || this.root);
  }

  check(value) {

  }

  extremum(type, parentNode) {
    if (!parentNode && type in this.history) {
      return this.history[type];
    }

    var node = parentNode || this.root;
    if (!node) {
      return null;
    }

    while (node[type]) {
      node = node[type];
    }

    if (!parentNode) {
      this.history[type] = node;
    }
    return node;
  }
}


module.exports = Tree;