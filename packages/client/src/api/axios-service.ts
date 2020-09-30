import * as C from './constants';
import queryString from 'query-string';

import Axios from 'axios';
const axios = Axios.create({ baseURL: C.BASE_URL });

export async function get<T>(route: string): Promise<T[]> {
    try { return (await axios.get(route)).data; }
    catch (e) { throw new Error(e); }
}

export async function getOne<T>(route: string): Promise<T> {
    try { return (await axios.get(route, {})).data; }
    catch (e) { throw new Error(e); }
}

export const getLanguages = async (): Promise<string[]> => {
    return get(`/${C.LANGUAGES}`);
}

export const getWords = async (query: Record<string, string>): Promise<string[]> => {
    return get(`/${C.WORDS}`);
    // return get(`/${C.OPINIONS}/${C.OPINIONS}?${queryString.stringify(query)}`);
}

export const getWord = async (id: string): Promise<string> => {
    return id;
    // return getOne(`/${C.OPINIONS}/${C.OPINIONS}/${id}`);
}

export const getScript = async (query: Record<string, string>): Promise<string[]> => {
    return get(`/${C.SCRIPT}`);
    // return get(`/${C.OPINIONS}/${C.OPINIONS}?${queryString.stringify(query)}`);
}