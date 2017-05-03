export interface Action {
  type: string;
  [key: string]: any;
}

export interface Store {
  getState: () => any;
  dispatch: (action: Action) => void;
  subscribe: (subscription: ()=>void)=>()=>void;
  replaceReducer: (reducer: Reducer)=>void;
}

export interface Reducer {
  (prevState: any, action: Action): any;
}
