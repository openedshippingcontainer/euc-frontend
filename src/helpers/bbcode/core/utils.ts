/* eslint-disable no-plusplus */
const isObj = (value: any) => (typeof value === "object");
const isBool = (value: any) => (typeof value === "boolean");

export function iterate(t: any, cb: (child: any) => any) {
  const tree = t;

  if (Array.isArray(tree)) {
    for (let idx = 0; idx < tree.length; idx++) {
      tree[idx] = iterate(cb(tree[idx]), cb);
    }
  } else if (tree && isObj(tree) && tree.content) {
    iterate(tree.content, cb);
  }

  return tree;
}

function same(expected: any, actual: any): boolean {
  if (typeof expected !== typeof actual)
    return false;

  if (!isObj(expected) || expected === null)
    return expected === actual;

  if (Array.isArray(expected)) {
    return expected.every((exp) => (
      [].some.call(actual, (act) => same(exp, act))
    ));
  }

  return Object.keys(expected).every((key) => {
    const ao = actual[key];
    const eo = expected[key];

    if (isObj(eo) && eo !== null && ao !== null)
      return same(eo, ao);

    if (isBool(eo))
      return eo !== (ao === null);

    return ao === eo;
  });
}

export function match(this: { parse: any; render: any; iterate: (t: any, cb: (child: any) => any) => any; match: (expression: any, cb: (child: any) => any) => any; data: any; }, expression: any, cb: (child: any) => any) {
  return Array.isArray(expression)
    ? iterate(this, (node) => {
      for (let idx = 0; idx < expression.length; idx++) {
        if (same(expression[idx], node))
          return cb(node);
      }

      return node;
    })
    : iterate(this, (node) => (same(expression, node) ? cb(node) : node));
}
