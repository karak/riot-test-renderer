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
`; // TODO: Fix position of "each"

export const tagWithIf = `
<tag>
  <p if={ opts.exists }>Exists</p>
</tag>
`;

export const tagWithIfNested = `
<tag>
  <div>
    <p if={ opts.exists }>Visible</p>
  </div>
</tag>
`;

export const tagWithShow = `
<tag>
  <p show={ opts.show }>Visible</p>
</tag>
`;

export const tagWithHidden = `
<tag>
  <p hidden={ opts.hidden }>Visible</p>
</tag>
`;

export const tagWithParent = `
<tag>
  <tag2>
    <p>{ parent.opts.data }</p>
  </tag2>
</tag>
`;
