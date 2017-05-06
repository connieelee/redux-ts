"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = require("sinon");
const createStore_1 = require("../createStore");
const reducer_1 = require("./helpers/reducer");
describe('createStore', () => {
    let store, catsReducerSpy;
    const marcy = { name: 'Marcy' }, addCatAction = { type: 'ADD_CAT', cat: marcy };
    const murphy = { name: 'Murphy' }, addDogAction = { type: 'ADD_DOG', dog: murphy };
    const unknownAction = { type: 'UNKNOWN' };
    beforeEach(() => {
        catsReducerSpy = sinon_1.spy(reducer_1.catsReducer);
        store = createStore_1.default(catsReducerSpy);
    });
    it('exposes public APIs', () => {
        chai_1.expect(Object.keys(store)).to.have.lengthOf(4);
        chai_1.expect(store.getState).to.be.a('function');
        chai_1.expect(store.dispatch).to.be.a('function');
        chai_1.expect(store.subscribe).to.be.a('function');
        chai_1.expect(store.replaceReducer).to.be.a('function');
    });
    describe('reducer', () => {
        it('expects reducer to be a function', () => {
            chai_1.expect(createStore_1.default.bind(null, 'not a func'))
                .to.throw(TypeError, 'Expected reducer to be a function');
            chai_1.expect(store.replaceReducer.bind(null, 'not a func'))
                .to.throw(TypeError, 'expects a function');
        });
        it('initiates state by running the reducer', () => {
            chai_1.expect(catsReducerSpy.called).to.be.true;
            chai_1.expect(store.getState()).to.deep.equal(reducer_1.initialState);
        });
        it('preserves previous state when replacing reducer', () => {
            const originalState = store.getState();
            const catsReducerSpy = sinon_1.spy(reducer_1.dogsReducer);
            store.replaceReducer(catsReducerSpy);
            chai_1.expect(catsReducerSpy.called).to.be.false;
            chai_1.expect(store.getState()).to.deep.equal(originalState);
            store.dispatch(addDogAction);
            chai_1.expect(catsReducerSpy.calledOnce).to.be.true;
        });
    });
    describe('dispatch', () => {
        it('calls reducer with action object', () => {
            const timesCalled = catsReducerSpy.callCount;
            const prevState = store.getState();
            store.dispatch(addCatAction);
            chai_1.expect(catsReducerSpy.callCount).to.equal(timesCalled + 1);
            chai_1.expect(catsReducerSpy.lastCall.args).to.deep.equal([prevState, addCatAction]);
        });
        it('updates state if what reducer returns !== current state', () => {
            const expectedState = Object.assign({}, store.getState());
            expectedState.cats = expectedState.cats.concat(marcy);
            store.dispatch(addCatAction);
            chai_1.expect(store.getState()).to.deep.equal(expectedState);
        });
    });
    describe('subscribe', () => {
        it('throws TypeError if argument is not a function', () => {
            chai_1.expect(store.subscribe.bind(null, 'not a func'))
                .to.throw(TypeError, 'subscribe expects a function');
        });
        it('runs all active subscriptions only when state changes', () => {
            const spies = [sinon_1.spy(), sinon_1.spy(), sinon_1.spy()];
            spies.forEach(spy => store.subscribe(spy));
            store.dispatch(addCatAction);
            spies.forEach(spy => chai_1.expect(spy.calledOnce).to.be.true);
            store.dispatch(unknownAction);
            spies.forEach(spy => chai_1.expect(spy.calledTwice).to.be.false);
        });
        it('returns a function that removes a subscription when invoked', () => {
            const spy1 = sinon_1.spy(), spy2 = sinon_1.spy();
            const unsubscribeSpy1 = store.subscribe(spy1);
            const unsubscribeSpy2 = store.subscribe(spy2);
            store.dispatch(addCatAction);
            chai_1.expect(spy1.calledOnce).to.be.true;
            chai_1.expect(spy2.calledOnce).to.be.true;
            unsubscribeSpy1();
            store.dispatch(addCatAction);
            chai_1.expect(spy1.calledOnce).to.be.true;
            chai_1.expect(spy2.calledTwice).to.be.true;
        });
    });
    describe('enhancer', () => {
        const enhancer = () => () => { };
        it('is an optional argument', () => {
            chai_1.expect(createStore_1.default.bind(null, reducer_1.catsReducer)).to.not.throw();
        });
        it('expects the enhancer to be a function', () => {
            chai_1.expect(createStore_1.default.bind(null, reducer_1.catsReducer, { cats: [] }, 'not a func'))
                .to.throw(TypeError, 'Expected enhancer to be a function');
        });
        it('is able to recognize enhancer function even without optional preloadedState provided', () => {
            chai_1.expect(createStore_1.default.bind(null, reducer_1.catsReducer, enhancer)).to.not.throw();
        });
    });
});
