<template>
    <div class="container grid-lg my-2 py-2">
        <div class="card mb-2" v-if="listenQuotes.length > 0">
            <div class="card-header">
                <div class="h4">Acompanhando</div>
            </div>
            <div class="card-body">
                <WatchListQuotes
                    :listen-quotes="listenQuotes"
                    @unlisten="onUnlisten"
                />
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <div class="h4">Todas as moedas</div>
            </div>
            <div class="card-body">
                <ListQuotes
                    :quotes="quotes"
                    :listen-quotes="listenQuotes"
                    @listen="onListen"
                    @unlisten="onUnlisten"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { onMounted, reactive, toRefs } from 'vue';
import api from '@/services/api';
import ListQuotes from './components/ListQuotes.vue';
import WatchListQuotes from './components/WatchListQuotes.vue';
import { Quotes } from './types/quotes';

@Options({
    name: 'App',
    components: { ListQuotes, WatchListQuotes },
    setup() {
        const data: {
            quotes: Quotes;
            listenQuotes: string[];
        } = reactive({
            quotes: {},
            listenQuotes: [],
        });
        onMounted(async () => {
            const response = await api.all();
            data.quotes = response.data;
        });
        function onListen(code: string) {
            data.listenQuotes.push(code);
        }
        function onUnlisten(code: string) {
            data.listenQuotes = data.listenQuotes.filter((key) => key !== code);
        }
        return {
            ...toRefs(data),
            onListen,
            onUnlisten,
        };
    },
})
export default class App extends Vue {}
</script>
