"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon_1 = require("sinon");
var createStore_1 = require("../createStore");
var reducer_1 = require("./helpers/reducer");
describe('createStore', function () {
    var store, reducerSpy;
    var addCatAction = { type: 'ADD_CAT', cat: { name: 'Marcy' } };
    var unknownAction = { type: 'UNKNOWN' };
    beforeEach(function () {
        reducerSpy = sinon_1.spy(reducer_1.default);
        store = createStore_1.default(reducerSpy);
    });
    it('exposes public APIs', function () {
        chai_1.expect(Object.keys(store)).to.have.lengthOf(4);
        chai_1.expect(store.getState).to.be.a.function;
        chai_1.expect(store.dispatch).to.be.a.function;
        chai_1.expect(store.subscribe).to.be.a.function;
        chai_1.expect(store.replaceReducer).to.be.a.function;
    });
    it('expects reducer to be a function', function () {
        chai_1.expect(createStore_1.default.bind(null, 'not a func')).to.throw(Error);
    });
    it('initiates state by running the reducer', function () {
        chai_1.expect(reducerSpy.called).to.be.true;
        chai_1.expect(store.getState()).to.deep.equal({ cats: [] });
    });
    it('dispatch calls reducer with action object', function () {
        var timesCalled = reducerSpy.callCount;
        var prevState = store.getState();
        store.dispatch(addCatAction);
        chai_1.expect(reducerSpy.callCount).to.equal(timesCalled + 1);
        chai_1.expect(reducerSpy.lastCall.args).to.deep.equal([prevState, addCatAction]);
    });
    describe('subscribe', function () {
        it('throws error if argument is not a function', function () {
            chai_1.expect(store.subscribe.bind(null, 'not a func')).to.throw(Error);
        });
        it('runs all active subscriptions only when state changes', function () {
            var spies = [sinon_1.spy(), sinon_1.spy(), sinon_1.spy()];
            spies.forEach(function (spy) { return store.subscribe(spy); });
            store.dispatch(addCatAction);
            spies.forEach(function (spy) { return chai_1.expect(spy.calledOnce).to.be.true; });
            store.dispatch(unknownAction);
            spies.forEach(function (spy) { return chai_1.expect(spy.calledTwice).to.be.false; });
        });
        it('returns a function that removes a subscription when invoked', function () {
            var spy1 = sinon_1.spy(), spy2 = sinon_1.spy();
            var unsubscribeSpy1 = store.subscribe(spy1);
            var unsubscribeSpy2 = store.subscribe(spy2);
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
