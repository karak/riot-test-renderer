declare module '@wildpeaks/snapshot-dom' {
  interface SnapshotElement {
    tagName: string;
    attributes: { [name: string]: any };
    childNodes: SnapshotElement[];
  }

  export function toJSON(element: Element): SnapshotElement;
}
