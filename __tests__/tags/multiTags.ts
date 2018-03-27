
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
