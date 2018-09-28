import {switchCase} from './switchCase';

it('Executes the "then" clause of the cases resolving to true', () => {
      const example = {};
      example.case = true;
      example.then = jest.fn();
      switchCase([example]);
      expect(example.then.mock.calls.length).toEqual(1);
});

it('Does not execute the "then" clause of the cases resolving to false', () => {
      const example = {};
      example.case = false;
      example.then = jest.fn();
      switchCase([example]);
      expect(example.then.mock.calls.length).toEqual(0);
});