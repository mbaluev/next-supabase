import { guid } from '@/utils/guid';

export type TTreeState = {
  level?: number;
  hidden?: boolean | null;
  collapsed?: boolean | null;
  selected?: boolean | null;
};

export type TTreeDTO<T> = {
  id: string;
  pid: string | null;
  state: TTreeState;
  items: TTreeDTO<T>[];
  data?: T;
};

export const DEFAULT_STATE: TTreeState = {
  level: 0,
  hidden: false,
  collapsed: false,
  selected: false,
};

export class CTreeNode<T> {
  id: string;
  pid: string | null;
  state: TTreeState;
  items: CTreeNode<T>[];
  data?: T;

  constructor(id: string, pid: string | null, state: TTreeState, data?: T, items?: CTreeNode<T>[]) {
    this.id = id;
    this.pid = pid;
    this.data = data;
    this.items = items || [];
    this.state = state;
  }

  get isLeaf() {
    return this.items.length === 0;
  }
  get isParent() {
    return this.state.level === 0;
  }
  get isRoot() {
    return !this.pid;
  }
}

export class CTree<T> {
  root: CTreeNode<T>;

  constructor(key?: string, state?: TTreeState, data?: T, items?: CTreeNode<T>[]) {
    const _key = key || guid();
    const _state: TTreeState = { ...DEFAULT_STATE, ...state };
    this.root = new CTreeNode(_key, null, _state, data, items);
  }

  public clone(): CTree<T> {
    return new CTree<T>(this.root.id, this.root.state, this.root.data, this.root.items);
  }

  *preOrderTraversal(node = this.root): Generator<CTreeNode<T>, any, undefined> {
    yield node;
    if (node.items.length) {
      for (const child of node.items) {
        yield* this.preOrderTraversal(child);
      }
    }
  }

  *postOrderTraversal(node = this.root): Generator<CTreeNode<T>, any, undefined> {
    if (node.items.length) {
      for (const child of node.items) {
        yield* this.postOrderTraversal(child);
      }
    }
    yield node;
  }

  // crud

  get(id: string, root?: CTreeNode<T>) {
    for (const node of this.preOrderTraversal(root)) {
      if (node.id === id) return node;
    }
    return undefined;
  }

  find(predicate: (value: CTreeNode<T>) => boolean, root?: CTreeNode<T>) {
    for (const node of this.preOrderTraversal(root)) {
      if (predicate(node)) return node;
    }
    return undefined;
  }

  insert(id: string, pid: string | null, data?: T, state?: TTreeState) {
    for (const node of this.preOrderTraversal()) {
      if (node.id === pid) {
        const _state: TTreeState = {
          ...DEFAULT_STATE,
          level: (node.state.level || 0) + 1,
          ...state,
        };
        node.items.push(new CTreeNode(id, node.id, _state, data));
        return true;
      }
    }
    return false;
  }

  removeNode(id: string) {
    for (const node of this.preOrderTraversal()) {
      const filtered = node.items.filter((c: CTreeNode<T>) => c.id !== id);
      if (filtered.length !== node.items.length) {
        node.items = filtered;
        return true;
      }
    }
    return false;
  }

  removeAll(id: string) {
    for (const node of this.preOrderTraversal()) {
      if (node.id === id) {
        node.items = [];
      }
    }
  }

  leafs = (x: CTreeNode<T>) => x.isLeaf;

  flat() {
    const collection: TTreeDTO<T>[] = [];
    for (const node of this.preOrderTraversal()) {
      const { id, pid, state, data, items } = node;
      if (pid !== null) collection.push({ id, pid, data, items, state });
    }
    return collection;
  }

  toObject(): TTreeDTO<T> {
    const toObjectValue = (node: CTreeNode<T>) => {
      const { id, pid, data, state, items } = node;
      const object: any = { id, pid, data, state, items: items.map(toObjectValue) };
      return object;
    };
    return toObjectValue(this.root);
  }

  isEmpty(): boolean {
    return this.flat().filter((d) => !d.state.hidden).length === 0;
  }

  static toTree<T>(tree?: TTreeDTO<T>): CTree<T> {
    const insert = (
      root: CTree<any>,
      id: string,
      pid: string | null,
      state: TTreeState,
      items?: TTreeDTO<T>[],
      data?: T
    ) => {
      root.insert(id, pid, data, state);
      items?.forEach((d: TTreeDTO<T>) => insert(root, d.id, d.pid, d.state, d.items, d.data));
    };
    const _root = new CTree<any>(tree?.id, tree?.state, tree?.data);
    tree?.items?.forEach((d: any) => insert(_root, d.id, d.pid, d.state, d.items, d.data));
    return _root;
  }

  // helpers

  toggleValueNode(key: string, name: keyof TTreeState, value: any) {
    for (const node of this.preOrderTraversal()) {
      if (node.id === key) {
        node.state[name] = value as never;
      }
    }
  }

  toggleValueAll(key: string, name: keyof TTreeState, value: any) {
    const root = this.get(key);
    for (const node of this.preOrderTraversal(root)) {
      node.state[name] = value as never;
    }
  }

  // toggle

  expand(key: string) {
    const node = this.get(key);
    if (node) {
      this.toggleValueNode(key, 'collapsed', false);
      for (const child of node.items) {
        this.toggleValueNode(child.id, 'hidden', false);
      }
    }
  }

  collapse(key: string) {
    const node = this.get(key);
    if (node) {
      this.toggleValueAll(key, 'collapsed', true);
      for (const child of node.items) {
        this.toggleValueAll(child.id, 'hidden', true);
      }
    }
  }

  toggle(key: string) {
    const node = this.get(key);
    if (node) {
      if (node.state.collapsed) {
        this.expand(key);
      } else {
        this.collapse(key);
      }
    }
  }

  expandFrom(from = 0) {
    for (const node of this.preOrderTraversal()) {
      node.state.collapsed = false;
      if (node.state.level && node.state.level >= from) {
        node.state.hidden = false;
      }
    }
  }

  collapseTo(to = 0) {
    for (const node of this.preOrderTraversal()) {
      node.state.collapsed = true;
      if (node.state.level && node.state.level > to) {
        node.state.hidden = true;
      }
    }
  }

  // select

  deselect() {
    for (const node of this.preOrderTraversal()) node.state.selected = false;
  }

  selectParents(node: CTreeNode<T>) {
    if (node.items.length > 0) {
      let selected = false;
      for (const child of node.items) selected = selected || !!child.state.selected;
      node.state.selected = selected;
      if (selected) {
        node.state.collapsed = false;
        for (const child of node.items) child.state.hidden = false;
      }
    }
  }

  select(key: string, value: boolean) {
    this.deselect();
    const root = this.get(key);
    for (const node of this.postOrderTraversal(root)) node.state.selected = value;
    for (const node of this.postOrderTraversal()) this.selectParents(node);
  }

  check(key: string, value: boolean) {
    this.deselect();
    if (value) this.expand(key);
    for (const node of this.postOrderTraversal()) {
      this.selectParents(node);
      if (node.id === key) node.state.selected = value;
    }
  }
}
