import { ActionContext, createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';

type State = {
    listenQuotes: string[];
};

const state: State = {
    listenQuotes: [],
};

const vuexLocal = new VuexPersistence<State>({
    key: '#currency-app',
    storage: window.localStorage,
});

const store = createStore({
    state,
    mutations: {
        addQuoteToListen(state, payload: string) {
            if (!state.listenQuotes.includes(payload)) {
                state.listenQuotes.push(payload);
            }
        },
        removeListenedQuote(state, payload: string) {
            if (state.listenQuotes.includes(payload)) {
                state.listenQuotes = state.listenQuotes.filter(
                    (quote) => quote !== payload
                );
            }
        },
    },
    actions: {
        addQuoteToListen(
            context: ActionContext<State, State>,
            quote: string
        ): void {
            const { commit } = context;
            commit('addQuoteToListen', quote);
        },
        removeListenedQuote(
            context: ActionContext<State, State>,
            quote: string
        ): void {
            const { commit } = context;
            commit('removeListenedQuote', quote);
        },
    },
    plugins: [vuexLocal.plugin],
});

export default store;
