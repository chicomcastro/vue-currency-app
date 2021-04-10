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
// import {
//     defineComponent,
//     onMounted,
//     onUnmounted,
//     reactive,
//     Ref,
//     ref,
//     toRefs,
//     watch,
// } from 'vue';
// import { Quotes } from '@/types/quotes';
import { Options, Vue } from 'vue-class-component';
import ListQuotes from './ListQuotes.vue';
import api from '@/services/api';

const CURRENT_UPDATE_TIME = 10;

// export default defineComponent({
//     components: { ListQuotes },
//     props: {
//         listenQuotes: { type: Array, required: true },
//     },
//     emits: ['unlisten'],
//     setup(props, { emit }) {
//         const interval: Ref<number | undefined> = ref(undefined);
//         const quotes: Ref<Quotes> = ref({});
//         const nextUpdateTime = ref(CURRENT_UPDATE_TIME);
//         const methods = reactive({
//             onUnlisten(code: string) {
//                 emit('unlisten', code);
//             },
//             restartInterval() {
//                 clearInterval(interval.value);
//                 nextUpdateTime.value = CURRENT_UPDATE_TIME;
//                 interval.value = setInterval(() => {
//                     nextUpdateTime.value -= 1;
//                     if (nextUpdateTime.value === 0) {
//                         nextUpdateTime.value = CURRENT_UPDATE_TIME;
//                         this.refresh();
//                     }
//                 }, 1000);
//             },
//             async refresh() {
//                 const { data } = await api.listen(
//                     props.listenQuotes as string[]
//                 );
//                 quotes.value = data;
//             },
//         });
//         onMounted(() => {
//             methods.refresh();
//             methods.restartInterval();
//         });
//         onUnmounted(() => {
//             clearInterval(interval.value);
//         });
//         watch(props, () => {
//             methods.refresh();
//             methods.restartInterval();
//         });
//         return {
//             ...toRefs(methods),
//             quotes,
//             nextUpdateTime,
//         };
//     },
// });
@Options({
    components: { ListQuotes },
    props: {
        listenQuotes: { type: Array, required: true },
    },
    emits: ['unlisten'],
    data() {
        return {
            interval: undefined,
            quotes: {},
            nextUpdateTime: CURRENT_UPDATE_TIME,
        };
    },
    methods: {
        onUnlisten(code: string) {
            this.refresh();
            this.$emit('unlisten', code);
        },
        restartInterval() {
            clearInterval(this.interval);
            this.nextUpdateTime = CURRENT_UPDATE_TIME;
            this.interval = setInterval(() => {
                this.nextUpdateTime -= 1;
                if (this.nextUpdateTime === 0) {
                    this.nextUpdateTime = CURRENT_UPDATE_TIME;
                    this.refresh();
                }
            }, 1000);
        },
        async refresh() {
            const { data } = await api.listen(this.listenQuotes as string[]);
            this.quotes = data;
        },
    },
    mounted() {
        this.refresh();
        this.restartInterval();
    },
    unmounted() {
        clearInterval(this.interval.value);
    },
    watch: {
        listenQuotes: {
            deep: true,
            handler() {
                this.refresh();
                this.restartInterval();
            },
        },
    },
})
export default class WatchListQuotes extends Vue {}
</script>
