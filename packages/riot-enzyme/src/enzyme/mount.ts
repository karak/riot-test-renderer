import TagInstance from 'riot-test-utils/dist/lib/TagInstance';
import VirtualDocument from 'riot-test-utils/dist/lib/VirtualDocument';
import toHTML from 'riot-test-utils/dist/lib/toHTML';

export default function mount<TOpts>(
  vdom: VirtualDocument,
  el: React.ReactElement<TOpts>
): Element | null {
  const tagInstance: TagInstance<TOpts> = (el as any)._tagInstance;

  const name = el.type as string;
  const container: HTMLElement = document.createElement(name);
  container.innerHTML = toHTML(tagInstance.root!);
  const hostNode = container.firstElementChild;
  if (hostNode !== null) {
    hostNode.parentNode!.removeChild(hostNode);
  }
  return hostNode;
}
