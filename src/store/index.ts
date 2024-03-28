import { createStore } from 'vuex'
import infoStore from "@/store/modules/service/infoStore";
import countryMappingStore from "@/store/modules/extra/countryMappingStore";

export default createStore({
  modules: {
    infoStore,
    countryMappingStore,
  }
})
