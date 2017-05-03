import { expect } from 'chai';
import { spy } from 'sinon';

import createStore from '../createStore';
import reducer from './helpers/reducer';
import { Store, Action } from '../types';

describe('createStore', () => {
  let store: Store, reducerSpy: sinon.SinonSpy;
  const addCatAction: Action = { type: 'ADD_CAT', cat: { name: 'Marcy' } };
  const unknownAction: Action = { type: 'UNKNOWN' };

  beforeEach(() => {
    reducerSpy = spy(reducer);
    store = createStore(reducerSpy);
  });

    it('exposes public APIs', () => {
      expect(Object.keys(store)).to.have.lengthOf(4);
      expect(store.getState).to.be.a('function');
      expect(store.dispatch).to.be.a('function');
      expect(store.subscribe).to.be.a('function');
      expect(store.replaceReducer).to.be.a('function');
    });
    
    it('expects reducer to be a function', () => {
      expect(createStore.bind(null, 'not a func')).to.throw(Error);
    });

    it('initiates state by running the reducer', () => {
      expect(reducerSpy.called).to.be.true;
      expect(store.getState()).to.deep.equal({ cats: [] });
    });

    it('preserves previous state when replacing reducer');

    it('dispatch calls reducer with action object', () => {
      const timesCalled = reducerSpy.callCount;
      const prevState = store.getState();

      store.dispatch(addCatAction);
      expect(reducerSpy.callCount).to.equal(timesCalled + 1);
      expect(reducerSpy.lastCall.args).to.deep.equal([prevState, addCatAction]);
    });

    describe('subscribe', () => {
      it('throws error if argument is not a function', () => {
        expect(store.subscribe.bind(null, 'not a func')).to.throw(Error);
      });

      it('runs all active subscriptions only when state changes', () => {
        const spies = [spy(), spy(), spy()];
        spies.forEach(spy => store.subscribe(spy));

        store.dispatch(addCatAction);
        spies.forEach(spy => expect(spy.calledOnce).to.be.true);

        store.dispatch(unknownAction);
        spies.forEach(spy => expect(spy.calledTwice).to.be.false);
      });

      it('returns a function that removes a subscription when invoked', () => {
        const spy1 = spy(), spy2 = spy();
        const unsubscribeSpy1 = store.subscribe(spy1);
        const unsubscribeSpy2 = store.subscribe(spy2);

        store.dispatch(addCatAction);
        expect(spy1.calledOnce).to.be.true;
        expect(spy2.calledOnce).to.be.true;

        unsubscribeSpy1();

        store.dispatch(addCatAction);
        expect(spy1.calledTwice).to.be.false;
        expect(spy2.calledTwice).to.be.true;
      });
    });
});
