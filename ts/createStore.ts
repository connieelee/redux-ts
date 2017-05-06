import { Action, Store, Reducer, Enhancer } from './types';

function createStore(reducer: Reducer, preloadedState?: any, enhancer?: Enhancer): Store {
  if (typeof reducer !== 'function') {
    throw new TypeError('Expected reducer to be a function.');
  }

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new TypeError('Expected enhancer to be a function.');
    }

    const enhancedCreateStore = enhancer(createStore);
    return enhancedCreateStore(reducer, preloadedState);
  }

  let currentState: any = reducer(preloadedState, { type: 'INIT' });
  let subscriptions: (()=>void)[] = [];

  function getState() {
    return currentState;
  }

  function dispatch(action: Action) {
      const nextState = reducer(currentState, action);
      if (nextState !== currentState) {
        currentState = nextState;
        subscriptions.forEach(sub => sub());
      }

  }

  function subscribe(subscription: ()=>void) {
    if (typeof subscription !== 'function') {
      throw new TypeError('subscribe expects a function');
    }
    
    subscriptions.push(subscription);
    return () => {
        const index = subscriptions.indexOf(subscription);
        subscriptions.splice(index, 1);
    }
  }

  function replaceReducer<S>(nextReducer: Reducer<S>) {
    if (typeof nextReducer !== 'function') {
      throw new TypeError('replaceReducer expects a function');
    }
    
    reducer = nextReducer;
  }

  return {
    getState,
    subscribe,
    dispatch,
    replaceReducer,
  };
}

export default createStore;
