import * as React from 'react';
import { TagInstance } from 'riot';

export interface EnzymeElement<P> extends React.ReactElement<P> {
  nodeType: 'host';
  instance: TagInstance | null;
  rendered: EnzymeNode | EnzymeNode[];
}

export type EnzymeNode = string | number | undefined | EnzymeElement<any>;
