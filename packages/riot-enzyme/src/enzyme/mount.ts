import { TagInstance } from 'riot';
import { toHTML } from 'riot-test-utils';

export default function mount<TOpts>(
  el: React.ReactElement<TOpts>
): Element | null {
  const tagInstance: TagInstance = (el as any)._tagInstance;

  const name = el.type as string;
  const container: HTMLElement = document.createElement(name);
  container.innerHTML = toHTML(tagInstance.root!);
  const hostNode = container.firstElementChild;
  if (hostNode !== null) {
    hostNode.parentNode!.removeChild(hostNode);
  }
  return hostNode;
}
