export const staticTag = `
<static>
  <p>Hello, world!</p>
</static>
`;

export const staticTagWithStyle = `
<static>
  <p>Hello, world!</p>
  <style>:scope static { font-size: large; }</style>
</static>
`;

export const tagWithOpts = `
<tag>
  <p>{ opts.data }</p>
</tag>
`;

export const tagWithEach = `
<tag each={ opts.items }>
  <p>{ this }</p>
</tag>
`;

export const tagWithParent = `
<tag>
  <tag2>
    <p>{ parent.opts.data }</p>
    <!-- parent is not <tag> but parent of it -->
  </tag2>
</tag>
`;
