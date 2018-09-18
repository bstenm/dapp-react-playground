import Log from '../services/Log';
import {dispatch} from '../store';

export const execEffect = async (action, onError) => {
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