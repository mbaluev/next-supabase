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
  data?: T;
  items: TTreeDTO<T>[];
  state: TTreeState;
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

  data?: T;

  state: TTreeState;

  items: CTreeNode<T>[];

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

  flat() {
    const collection: TTreeDTO<T>[] = [];
    for (const node of this.preOrderTraversal()) {
      const { id, pid, state, data, items } = node;
      if (pid !== null) collection.push({ id, pid, data, items, state });
    }
    return collection;
  }

  leafs = (x: CTreeNode<T>) => x.isLeaf;

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

  select(key: string, value: boolean) {
    const root = this.get(key);
    // clear
    this.deselect();
    // children
    for (const node of this.preOrderTraversal(root)) node.state.selected = value;
    // parent
    for (const node of this.postOrderTraversal()) {
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
  }
}
