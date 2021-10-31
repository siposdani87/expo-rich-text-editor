import React from 'react';
import ReactDOM from 'react-dom';
import { RichTextViewer } from '../src';

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<RichTextViewer html='' />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
