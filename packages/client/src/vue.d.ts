import { IState } from "./api/interfaces";
import * as d3 from "d3";
import { Store } from 'vuex';

declare module 'vue/types/vue' {
    interface Vue {
        $d3: d3;
        $store: Store<IState>;
    }
}