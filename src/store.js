import user from './state/user';
import {init} from '@rematch/core';
import alert from './state/alert';
import loading from './state/loading';
import candidates from './state/candidates';
import selectPlugin from '@rematch/select';

const store = init({
      models: {loading, candidates, user, alert},
      plugins: [selectPlugin()]
});

export const dispatch = store.dispatch;

export default store;