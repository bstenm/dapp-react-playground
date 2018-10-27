import Log from '../services/Log';
import { execEffect } from './execEffect';

describe('(Lib) execffect', () => {
      let dispatch;
      let logError;

      beforeEach(() => {
            dispatch = {
                  loading: {
                        stop: jest.fn(),
                        start: jest.fn(),
                  },
            };
      });

      describe('Action is successful', () => {
            let action;
            let res;
            let onError;

            beforeEach(() => {
                  action = () => new Promise((resolve, reject) => {
                        setTimeout(() => resolve('resolved'), 1000);
                  });
                  onError = jest.fn();
            });

            it('Dispatches a start loader event', async () => {
                  await execEffect(dispatch)(action, onError);
                  expect(dispatch.loading.start.mock.calls).toHaveLength(1);
            });

            it('Executes the action passed and returns its result', async () => {
                  res = await execEffect(dispatch)(action, onError);
                  expect(res).toEqual('resolved');
            });

            it('Dispatches a stop loader event', async () => {
                  await execEffect(dispatch)(action, onError);
                  expect(dispatch.loading.stop.mock.calls).toHaveLength(1);
            });
      });

      describe('Action is rejected', () => {
            let action;
            let res;
            let onError;

            beforeEach(() => {
                  action = () => new Promise((resolve, reject) => {
                        reject('rejected');
                  });
                  onError = jest.fn();
                  jest.spyOn(Log, 'error').mockImplementation(() => null);
            });

            afterEach(() => {
                  Log.error.mockRestore();
            });

            it('Dispatches a start loader event', async () => {
                  await execEffect(dispatch)(action, onError);
                  expect(dispatch.loading.start.mock.calls).toHaveLength(1);
            });

            it('Executes the error cb', async () => {
                  await execEffect(dispatch)(action, onError);
                  expect(onError.mock.calls).toHaveLength(1);
                  expect(onError.mock.calls[0][0]).toEqual('rejected');
            });

            it('Logs the error', async () => {
                  await execEffect(dispatch)(action, onError);
                  expect(Log.error.mock.calls).toHaveLength(1);
                  expect(Log.error.mock.calls[0][0]).toEqual('rejected');
            });

            it('Dispatches a stop loader event', async () => {
                  await execEffect(dispatch)(action, onError);
                  expect(dispatch.loading.stop.mock.calls).toHaveLength(1);
            });
      });
});
