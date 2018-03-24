/** Virtual element like `HTMLElement` */
type VirtualElement = {
  type: 'html';
  name: string;
  attributes: { [name: string]: any };
  children: VirtualChild[];
};

type VirtualChild = string | VirtualElement;

export {
  VirtualElement,
  VirtualChild,
};
