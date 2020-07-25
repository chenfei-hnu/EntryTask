import React from 'react';
import { mount } from 'enzyme';
import { EventProvider } from '@context/events';
import { AuthProvider } from '@context/auth';
import Setting from './Setting';

const setup = () => {
    return mount(
        <AuthProvider>
            <EventProvider>
                <Setting></Setting>
            </EventProvider>
        </AuthProvider>
    );
};
describe('Setting Test', () => {
    const wrapper = setup();
    test('测试是否渲染正常', () => {
        expect(wrapper.find('.icon-email').exists()).toBe(true);
    });
});
