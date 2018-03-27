import * as React from 'react';
import TagInstance from '../lib/TagInstance';

export interface EnzymeElement<P> extends React.ReactElement<P> {
  nodeType: 'host' | 'class' | 'function';
  instance: TagInstance<P> | null;
  rendered: EnzymeNode<P> | EnzymeNode<P>[];
}

export type EnzymeNode<P> = string | number | undefined | EnzymeElement<P>;
