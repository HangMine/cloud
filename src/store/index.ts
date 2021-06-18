import { createStore } from 'vuex';
import VuexORM from '@vuex-orm/core';
import * as orms from './orms';

const database = new VuexORM.Database();
Object.values(orms).forEach(Model => {
  database.register(Model);
});

export default createStore({
  plugins: [
    VuexORM.install(database),
  ],
});
