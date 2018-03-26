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

export const tagWithTags = `
<tag>
  <tag2>
    <p></p>
  </tag2>
  <div>
    <tag3>
      <p></p>
    </tag3>
  </div>
  <tag3></tag3>
</tag>
`;

export const tagWithEachAndTags = `
<tag each={ opts.items }>
  <tag2>{ this }</tags>
</tag>
`;

export const tagWithIf = `
<tag>
  <tag2 if={opts.exists}>
    <p>Exists</p>
  </tag2>
</tag>
`;

export const tagWithShow = `
<tag>
  <tag2 show={opts.visible}>
    <p>Visible</p>
  </tag2>
</tag>
`;

export const tagWithHide = `
<tag>
  <tag2 hide={!opts.visible}>
    <p>Visible</p>
  </tag2>
</tag>
`;
