import Log from '../services/Log';

export default dispatch => async (action, onError) => {
      try {
            dispatch.loading.start();
            return await action();
      } catch (e) {
            Log.error(e);
            if (onError) onError(e);
            return false;
      } finally {
            dispatch.loading.stop();
      }
};
