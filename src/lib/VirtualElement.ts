/** Virtual element like `HTMLElement` */
type VirtualElement = {
  name: string;
  attributes: { [name: string]: any };
  children: VirtualChild[];
  key?: string | number;
};

type VirtualChild = string | VirtualElement;

export { VirtualElement, VirtualChild };
