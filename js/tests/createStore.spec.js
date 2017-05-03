"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = require("sinon");
const createStore_1 = require("../createStore");
const reducer_1 = require("./helpers/reducer");
describe('createStore', () => {
    let store, reducerSpy;
    const addCatAction = { type: 'ADD_CAT', cat: { name: 'Marcy' } };
    const unknownAction = { type: 'UNKNOWN' };
    beforeEach(() => {
        reducerSpy = sinon_1.spy(reducer_1.default);
        store = createStore_1.default(reducerSpy);
    });
    it('exposes public APIs', () => {
        chai_1.expect(Object.keys(store)).to.have.lengthOf(4);
        chai_1.expect(store.getState).to.be.a('function');
        chai_1.expect(store.dispatch).to.be.a('function');
        chai_1.expect(store.subscribe).to.be.a('function');
        chai_1.expect(store.replaceReducer).to.be.a('function');
    });
    it('expects reducer to be a function', () => {
        chai_1.expect(createStore_1.default.bind(null, 'not a func')).to.throw(Error);
    });
    it('initiates state by running the reducer', () => {
        chai_1.expect(reducerSpy.called).to.be.true;
        chai_1.expect(store.getState()).to.deep.equal({ cats: [] });
    });
    it('preserves previous state when replacing reducer');
    it('dispatch calls reducer with action object', () => {
        const timesCalled = reducerSpy.callCount;
        const prevState = store.getState();
        store.dispatch(addCatAction);
        chai_1.expect(reducerSpy.callCount).to.equal(timesCalled + 1);
        chai_1.expect(reducerSpy.lastCall.args).to.deep.equal([prevState, addCatAction]);
    });
    describe('subscribe', () => {
        it('throws error if argument is not a function', () => {
            chai_1.expect(store.subscribe.bind(null, 'not a func')).to.throw(Error);
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
            chai_1.expect(spy1.calledTwice).to.be.false;
            chai_1.expect(spy2.calledTwice).to.be.true;
        });
    });
});
