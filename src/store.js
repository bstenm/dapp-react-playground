import user from './state/user';
import {init} from '@rematch/core';
import alert from './state/alert';
import candidates from './state/candidates';
import requesting from './state/requesting';
import selectorsPlugin from '@rematch/select';

const select = selectorsPlugin();

const store = init({
      models: {requesting, candidates, user, alert},
      plugins: [select]
});

export default store;