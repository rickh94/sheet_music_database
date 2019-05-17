import React from 'react';
import { shallow } from 'enzyme';
import Sheet from './Sheet';

import '../../setupTests'

describe('<Sheet />', () => {
  test('renders', () => {
    const wrapper = shallow(<Sheet />);
    expect(wrapper).toMatchSnapshot();
  });
});
