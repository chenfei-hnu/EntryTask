import React from 'react';
import { mount } from 'enzyme';
import { EventDetailProvider } from '@context/eventDetail';
import { AuthProvider } from '@context/auth';
import Detail from './Detail';

const setup = () => {
    return mount(
        <AuthProvider>
            <EventDetailProvider>
                <Detail eventId={0}></Detail>
            </EventDetailProvider>
        </AuthProvider>
    );
};
describe('Detail Test', () => {
    const wrapper = setup();
    test('测试是否渲染正常', () => {
        expect(wrapper.find('.detail-basic').exists()).toBe(true);
    });
    test('测试点击事件是否触发showCommentArea', () => {
        wrapper.find('.detail-operateComment').last().simulate('click');
        expect(wrapper.find('.test-hide').first().text()).toBe(
            'showComment:true;'
        );
    });
    test('测试点击事件是否触发doClose', () => {
        wrapper.find('.detail-close').last().simulate('click');
        expect(wrapper.find('.test-hide').first().text()).toBe(
            'showComment:false;'
        );
    });
});
