export const nestedStaticTag = `
<inner>
  <p></p>
</inner>
<outer>
  <inner />
</outer>
`;

export const nestedTag = `
<inner>
  <p>{opts.data}</p>
</inner>
<outer>
  <inner data={opts.innerData} />
</outer>
`;

export const tagWithParent = `
<tag2>
</tag2>
<tag>
  <tag2>
    <p>{ parent.opts.data }</p>
    <!-- parent is not <tag> but parent of it -->
  </tag2>
</tag>
`;

export const tagWithTags = `
<tag2>
</tag2>
<tag3>
</tag3>
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
<tag2>
</tag2>
<tag>
  <tag2 each={ item in opts.items }>{ item }</tags>
</tag>
`;
