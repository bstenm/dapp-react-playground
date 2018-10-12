import React from 'react';
import {shallow} from 'enzyme';
import Dropzone from 'react-dropzone';
import {Glyphicon, ControlLabel} from 'react-bootstrap';
import CandidateInfoAttachment from './CandidateInfoAttachment';

jest.mock('../../config');

const attachment = require('../../config').attachment;

describe('(Component) CandidateInfoAttachment', () => {
      let wrapper, props;

      beforeEach(() => {
            props = {
                  file: { name: 'name', preview: 'preview' },
                  // onDrop: jest.fn(),
                  onDropRejected: jest.fn(),
                  onDropAccepted: jest.fn()
            };
            wrapper = shallow(<CandidateInfoAttachment {...props} />);
      });

      it( 'Displays a CandidateInfoAttachment', () => {
            expect(wrapper.find('.CandidateInfoAttachment').length).toEqual(1);
      });

      // prop: accept
      it('Passes accept to Dropzone component', () => {
            const typesAllowed = attachment.allowedTypes.join(',');
            expect(wrapper.find(Dropzone).props().accept  ).toEqual(typesAllowed);
      });

      // prop: maxSize
      it('Passes the maximum file size allwoed to Dropzone component', () => {
            const { maxSize } = attachment;
            expect(wrapper.find(Dropzone).props().maxSize).toEqual(maxSize);
      });

      // prop: onDrop
      it('Passes a cb prop to handle the ondrop event to Dropzone component', () => {
            wrapper.find(Dropzone).props().onDrop('arg');
            expect(props.onDrop.mock.calls.length).toEqual(1);
            expect(props.onDrop.mock.calls[0][0]).toEqual('arg');
      });

      // props: onDropRejected
      it('Passes a cb prop to handle files rejected to Dropzone component', () => {
            wrapper.find(Dropzone).props().onDropRejected('arg');
            expect(props.onDropRejected.mock.calls.length).toEqual(1);
            expect(props.onDropRejected.mock.calls[0][0]).toEqual('arg');
      });

      // props: onDropAccepted
      it('Passes a cb prop to handle files accepted to Dropzone component', () => {
            wrapper.find(Dropzone).props().onDropAccepted('arg');
            expect(props.onDropAccepted.mock.calls.length).toEqual(1);
            expect(props.onDropAccepted.mock.calls[0][0]).toEqual('arg');
      });

      it('Displays a Glyphicon component inside the crop zone', () => {
            expect(wrapper.find(Dropzone).find(Glyphicon).length).toEqual(1);
      });

      it('Displays the file preview if any', () => {
            expect(wrapper.find('img').length).toEqual(1);
            expect(wrapper.find('img').props().src).toEqual('preview');
      });

      it('Does not attempt to display the file preview if none are passed', () => {
            wrapper.setProps({ file: null });
            expect(wrapper.find('img').length).toEqual(0);
      });
});

