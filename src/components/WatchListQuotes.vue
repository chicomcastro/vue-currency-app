<template>
    <ListQuotes
        :quotes="quotes"
        :listen-quotes="listenQuotes"
        @unlisten="onUnlisten"
    />
    <div class="mt-2 text-right">
        <cite class="text-small">
            Atualizará novamente em <b>{{ nextUpdateTime }} segundos</b>
        </cite>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { onMounted, onUnmounted, reactive, Ref, ref, toRefs, watch } from 'vue';
import ListQuotes from './ListQuotes.vue';
import api from '@/services/api';
import { Quotes } from '@/types/quotes';

const CURRENT_UPDATE_TIME = 10;

@Options({
    components: { ListQuotes },
    props: {
        listenQuotes: { type: Array, required: true },
    },
    emits: ['unlisten'],
    setup(props: { listenQuotes?: string[] }, { emit }) {
        const interval: Ref<number | undefined> = ref(undefined);
        const quotes: Ref<Quotes> = ref({});
        const nextUpdateTime = ref(CURRENT_UPDATE_TIME);
        const methods = reactive({
            onUnlisten(code: string) {
                emit('unlisten', code);
            },
            restartInterval() {
                clearInterval(interval.value);
                nextUpdateTime.value = CURRENT_UPDATE_TIME;
                interval.value = setInterval(() => {
                    nextUpdateTime.value -= 1;
                    if (nextUpdateTime.value === 0) {
                        nextUpdateTime.value = CURRENT_UPDATE_TIME;
                        this.refresh();
                    }
                }, 1000);
            },
            async refresh() {
                const { data } = await api.listen(props.listenQuotes);
                quotes.value = data;
            },
        });
        onMounted(() => {
            methods.refresh();
            methods.restartInterval();
        });
        onUnmounted(() => {
            clearInterval(interval.value);
        });
        watch(props, () => {
            methods.refresh();
            methods.restartInterval();
        });
        return {
            ...toRefs(methods),
            quotes,
            nextUpdateTime,
        };
    },
})
export default class WatchListQuotes extends Vue {}
</script>
