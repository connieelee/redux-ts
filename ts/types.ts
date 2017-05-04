export interface Action {
  type: string;
  [key: string]: any;
}

export interface Store<S> {
  getState: () => S;
  dispatch: (action: Action) => void;
  subscribe: (subscription: ()=>void)=>()=>void;
  replaceReducer: (reducer: Reducer<S>)=>void;
}

export interface Reducer<S> {
  (prevState: S, action: Action): S;
}

export interface CreateStore<S> {
  (reducer: Reducer<S>, initialState: S, enhancer?: Enhancer): Store<S>;
}

export interface Enhancer {
  (createStore: CreateStore): CreateStore;
}
