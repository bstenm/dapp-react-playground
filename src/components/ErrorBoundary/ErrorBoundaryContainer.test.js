import Log from '../../services/Log';
import React from 'react';
import {shallow} from 'enzyme';
import ErrorBoundary from './ErrorBoundary';
import {ErrorBoundaryContainer} from './ErrorBoundaryContainer';

describe('(Container) ErrorBoundaryContainer', () => {
      let wrapper, props;

      beforeEach(() => {
            props = { children: <div className="child"></div> };
            wrapper = shallow(<ErrorBoundaryContainer {...props} />);
      });

      it('Displays the children and no ErrorBoundary component if state error is null', () => {
            expect(wrapper.find('.child').length).toEqual(1);
            expect(wrapper.find(ErrorBoundary).length).toEqual(0);
      });

      it('Displays a ErrorBoundaryContainer component if state error is not null', () => {
            wrapper.setState({ error: true, errorInfo: 'error info'});
            expect(wrapper.find(ErrorBoundary).length).toEqual(1);
      });

      it('Updates the state and logs the error if componentDidCatch is triggered', () => {
           jest.spyOn(Log, 'error');
            wrapper.instance().componentDidCatch('error', 'errorInfo');
            expect(wrapper.state().error).toEqual('error');
            expect(wrapper.state().errorInfo).toEqual('errorInfo');
            expect(Log.error.mock.calls.length).toEqual(1);
            expect(Log.error.mock.calls[0][0] ).toEqual('errorInfo');
      });
});