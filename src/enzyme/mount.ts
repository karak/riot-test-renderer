import TagInstance from '../lib/TagInstance';
import VirtualDocument from '../lib/VirtualDocument';
import toHTML from '../lib/toHTML';

export default function mount<TOpts>(
  vdom: VirtualDocument,
  el: React.ReactElement<TOpts>
): Element | null {
  const tagInstance: TagInstance<TOpts> = (el as any)._tagInstance;

  const name = el.type as string;
  const container: HTMLElement = document.createElement(name);
  container.innerHTML = toHTML(tagInstance.root!, false);
  const hostNode = container.firstElementChild;
  if (hostNode !== null) {
    hostNode.parentNode!.removeChild(hostNode);
  }
  return hostNode;
}
