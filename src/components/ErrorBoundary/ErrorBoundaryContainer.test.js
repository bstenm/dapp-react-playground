import React from 'react';
import { shallow } from 'enzyme';
import Log from '../../services/Log';
import ErrorBoundary from './ErrorBoundary';
import { ErrorBoundaryContainer } from './ErrorBoundaryContainer';

describe('(Container) ErrorBoundaryContainer', () => {
      let wrapper;
      let props;

      beforeEach(() => {
            props = { children: <div className="child" /> };
            wrapper = shallow(<ErrorBoundaryContainer {...props} />);
      });

      it('Displays the children and no ErrorBoundary component if state error is null', () => {
            expect(wrapper.find('.child')).toHaveLength(1);
            expect(wrapper.find(ErrorBoundary)).toHaveLength(0);
      });

      it('Displays a ErrorBoundaryContainer component if state error is not null', () => {
            wrapper.setState({ error: true });
            expect(wrapper.find(ErrorBoundary)).toHaveLength(1);
      });

      it('Updates the state and logs the error if componentDidCatch is triggered', () => {
            jest.spyOn(Log, 'error').mockImplementation(() => null);
            wrapper.instance().componentDidCatch('error', 'errorInfo');
            expect(wrapper.state().error).toEqual('error');
            expect(Log.error.mock.calls).toHaveLength(1);
            expect(Log.error.mock.calls[0][0]).toEqual('errorInfo');
      });
});
