import React from 'react';
import { mount } from 'enzyme';
import { EventProvider } from '@context/events';
import Popover from './Popover.module';

const setup = () => {
    const laterPosition = {
        x: 0,
        y: 0,
    };
    return mount(
        <EventProvider>
            <Popover visible={true} laterPosition={laterPosition}></Popover>
        </EventProvider>
    );
};
describe('Popover Test', () => {
    const wrapper = setup();
    test('测试是否渲染正常', () => {
        expect(wrapper.find('.am-popover-arrow').exists()).toBe(true);
    });
});
