import { expect } from 'chai';
import { spy } from 'sinon';

import createStore from '../createStore';
import { initialState, catsReducer, dogsReducer } from './helpers/reducer';
import { Store , Action } from '../types';

describe('createStore', () => {
  let store: Store<{[key: string]: any}>, catsReducerSpy: sinon.SinonSpy;

  const marcy = { name: 'Marcy' },
        addCatAction: Action = { type: 'ADD_CAT', cat: marcy };

  const murphy = { name: 'Murphy' },
        addDogAction: Action = { type: 'ADD_DOG', dog: murphy };

  const unknownAction: Action = { type: 'UNKNOWN' };

  beforeEach(() => {
    catsReducerSpy = spy(catsReducer);
    store = createStore(catsReducerSpy);
  });

    it('exposes public APIs', () => {
      expect(Object.keys(store)).to.have.lengthOf(4);
      expect(store.getState).to.be.a('function');
      expect(store.dispatch).to.be.a('function');
      expect(store.subscribe).to.be.a('function');
      expect(store.replaceReducer).to.be.a('function');
    });
    
    it('expects reducer to be a function', () => {
      expect(createStore.bind(null, 'not a func')).to.throw(TypeError);
      expect(store.replaceReducer.bind(null, 'not a func')).to.throw(TypeError);
    });

    it('initiates state by running the reducer', () => {
      expect(catsReducerSpy.called).to.be.true;
      expect(store.getState()).to.deep.equal(initialState);
    });

    it('preserves previous state when replacing reducer', () => {
      const originalState = store.getState();
      const catsReducerSpy = spy(dogsReducer);

      store.replaceReducer(catsReducerSpy);
      expect(catsReducerSpy.called).to.be.false;
      expect(store.getState()).to.deep.equal(originalState);

      store.dispatch(addDogAction);
      expect(catsReducerSpy.calledOnce).to.be.true;
    });

    describe('dispatch', () => {
      it('calls reducer with action object', () => {
        const timesCalled = catsReducerSpy.callCount;
        const prevState = store.getState();

        store.dispatch(addCatAction);
        expect(catsReducerSpy.callCount).to.equal(timesCalled + 1);
        expect(catsReducerSpy.lastCall.args).to.deep.equal([prevState, addCatAction]);
      });

      it('updates state if what reducer returns !== current state', () => {
        const expectedState = Object.assign({}, store.getState());
        expectedState.cats = expectedState.cats.concat(marcy);

        store.dispatch(addCatAction);
        expect(store.getState()).to.deep.equal(expectedState);
      });
    });

    describe('subscribe', () => {
      it('throws TypeError if argument is not a function', () => {
        expect(store.subscribe.bind(null, 'not a func')).to.throw(TypeError);
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
        expect(spy1.calledOnce).to.be.true;
        expect(spy2.calledTwice).to.be.true;
      });
    });
});
