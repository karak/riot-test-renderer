import unionWith from 'lodash/unionWith';
import reduce from 'lodash/reduce';
import map from './map';
import compare from './compare';
import toNodeList from './toNodeList';

export default function findList(
  selector: string,
  nodeList: NodeListOf<Element>
) {
  const arrayOfNodes = map(nodeList, x => x.querySelectorAll(selector));
  const unitedNodes = reduce(
    arrayOfNodes,
    (prev, nodes) => unionWith(prev, nodes, compare),
    [] as Array<Element>
  );
  return toNodeList(unitedNodes);
}
