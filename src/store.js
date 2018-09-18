import user from './state/user';
import {init} from '@rematch/core';
import alert from './state/alert';
import candidates from './state/candidates';
import loading from './state/loading';
import selectorsPlugin from '@rematch/select';

const select = selectorsPlugin();

const store = init({
      models: {loading, candidates, user, alert},
      plugins: [select]
});

export const dispatch = store.dispatch;

export default store;