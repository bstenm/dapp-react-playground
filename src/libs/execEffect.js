import Log from '../services/Log';

export const execEffect = dispatch => async (action, onError) => {
      try {
            dispatch.loading.start();
            return await action();
      } catch (e) {
            Log.error(e);
            if (onError) onError(e);
      } finally {
            dispatch.loading.stop();
      }
};