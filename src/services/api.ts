import { Quotes } from '@/types/quotes';
import axios, { AxiosResponse } from 'axios';

const api = axios.create({
    baseURL: 'https://economia.awesomeapi.com.br/json',
});

export default {
    all(): Promise<AxiosResponse<Quotes>> {
        return api.get('/all');
    },

    listen(codes: string[] = []): Promise<AxiosResponse<Quotes>> {
        return api.get(`/all/${codes.join()}`);
    },
};
