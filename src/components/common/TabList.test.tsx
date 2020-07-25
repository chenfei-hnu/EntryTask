import React from 'react';
import { mount } from 'enzyme';
import TabList from './TabList';
import { EventDetailProvider } from '@context/eventDetail';
import { EventProvider } from '@context/events';
import { AuthProvider } from '@context/auth';
import { ITab } from '@reducers/eventList';

const setup = () => {
    const tabsData: ITab[] = [
        { type: 'Likes', icon: 'like', count: 0, flex: 1 },
        { type: 'Going', icon: 'check', count: 0, flex: 1 },
        { type: 'Past', icon: 'past', count: 0, flex: 1 },
    ];
    return mount(
        <AuthProvider>
            <EventProvider>
                <EventDetailProvider>
                    <TabList data={tabsData}></TabList>
                </EventDetailProvider>
            </EventProvider>
        </AuthProvider>
    );
};
describe('TabList Test', () => {
    const wrapper = setup();
    test('测试是否渲染正常', () => {
        expect(wrapper.find('.tabList-middleItem').exists()).toBe(true);
    });
    test('测试点击事件是否触发', () => {
        wrapper.find('.tabList-middleItem').last().simulate('click');
        expect(
            wrapper
                .find('.tabList-middleItem')
                .last()
                .hasClass('tabList-active')
        ).toBe(true);
    });
});
