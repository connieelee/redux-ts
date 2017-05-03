import { Action, Store, Reducer } from './types';

function createStore(reducer: Reducer): Store {
  if (typeof reducer !== 'function') throw new Error('Reducer must be a function');

  let currentState: any = reducer(undefined, { type: 'INIT' });
  let subscriptions: (()=>void)[] = [];

  function getState() {
    return currentState;
  }

  function dispatch(action: Action) {
      const nextState = reducer(currentState, action);
      if (nextState !== currentState) {
        subscriptions.forEach(sub => sub());
      }
  }

  function subscribe(subscription: ()=>void) {
    if (typeof subscription !== 'function') throw new Error('subscribe expects a function');
    subscriptions.push(subscription);
    return () => {
        subscriptions = subscriptions.filter(sub => sub !== subscription);
    }
  }

  function replaceReducer(reducer: Reducer) {
    
  }

  return {
    getState,
    subscribe,
    dispatch,
    replaceReducer,
  };
}

export default createStore;
