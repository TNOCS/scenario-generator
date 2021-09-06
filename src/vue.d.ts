import { IState } from "./api/interfaces";
import { IActions, IAppModel } from "./services/meiosis";
import OverpassService from "./services/overpass-service";

declare module "vue/types/vue" {
  interface Vue {
    $store: { states: flyd.Stream<IAppModel>; actions: IActions };
    $overpass: OverpassService;
  }
}
