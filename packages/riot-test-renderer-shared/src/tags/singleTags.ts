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
<tag>
  <p each={ item in opts.items }>{ item }</p>
</tag>
`;

export const tagWithIfNested = `
<tag>
  <div>
    <p if={ opts.exists }>Exists</p>
  </div>
</tag>
`;

export const tagWithIf = `
<tag>
  <div if={opts.exists}>
    <p>Exists</p>
  </div>
</tag>
`;

export const tagWithShow = `
<tag>
  <div show={opts.visible}>
    <p>Visible</p>
  </div>
</tag>
`;

export const tagWithHide = `
<tag>
  <div hide={!opts.visible}>
    <p>Visible</p>
  </div>
</tag>
`;
