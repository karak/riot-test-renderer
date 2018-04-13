import * as React from 'react';
import { TagInstance } from 'riot';

export interface EnzymeElement<P> extends React.ReactElement<P> {
  nodeType: 'host' | 'class' | 'function';
  instance: TagInstance | null;
  rendered: EnzymeNode<P> | EnzymeNode<P>[];
}

export type EnzymeNode<P> = string | number | undefined | EnzymeElement<P>;
