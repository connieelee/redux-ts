function createStore(reducer: (prevState: object, action:object)=>object, initialState?: object) {
  if (typeof reducer !== 'function') throw new Error('Reducer must be a function');

  let currentState: object = Object.assign({}, initialState, reducer(undefined, {}));
  let subscriptions: (()=>void)[] = [];

  function getState() {
    return currentState;
  }

  function dispatch(action: object) {
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

  function replaceReducer() {

  }

  return {
    getState,
    subscribe,
    dispatch,
    replaceReducer,
  }
}

export default createStore;
