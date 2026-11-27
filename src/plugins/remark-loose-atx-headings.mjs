import { visit } from 'unist-util-visit';

/** CommonMark 要求 # 后有空格；兼容 `###《书名》` 这类写法 */
export function normalizeLooseAtxHeadings(source) {
  if (!source) return source;
  let text = source.replace(/^(\s{0,3})(#{1,6})([^\s#\n])/gm, '$1$2 $3');
  text = text.replace(/([^\n#])(\s+)(#{1,6})([^\s#\n])/g, '$1\n\n$3 $4');
  return text;
}

export function remarkLooseAtxHeadings() {
  return (tree) => {
    const ops = [];
    visit(tree, 'paragraph', (node, index, parent) => {
      if (!parent || index == null || parent.type !== 'root') return;
      if (node.children.length !== 1 || node.children[0].type !== 'text') return;
      const value = node.children[0].value;
      const match = value.match(/^(#{1,6})([^\s#].+)$/);
      if (!match) return;
      ops.push({
        parent,
        index,
        node: {
          type: 'heading',
          depth: match[1].length,
          children: [{ type: 'text', value: match[2] }],
        },
      });
    });
    ops.reverse().forEach((op) => {
      op.parent.children[op.index] = op.node;
    });
  };
}