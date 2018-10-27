import { init } from '@rematch/core';
import selectPlugin from '@rematch/select';
import user from './state/user';
import alert from './state/alert';
import loading from './state/loading';
import candidates from './state/candidates';

const store = init({
      models: {
            loading,
            candidates,
            user,
            alert,
      },
      plugins: [selectPlugin()],
});

export default store;
