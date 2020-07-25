import React from 'react';
import { mount } from 'enzyme';
import { AuthProvider } from '@context/auth';
import { EventProvider } from '@context/events';
import Header from '@Header';

const setup = () => {
    return mount(
        <AuthProvider>
            <EventProvider>
                <Header></Header>
            </EventProvider>
        </AuthProvider>
    );
};
describe('Header Test', () => {
    const wrapper = setup();
    test('测试组件是否正常渲染', () => {
        expect(wrapper.find('.header-topContainer').exists()).toBe(true);
    });
    test('测试是否根据路由显示不同图标', () => {
        expect(wrapper.find('.header-searchBtn').exists()).toBe(true);
        expect(wrapper.find('.header-homeBtn').exists()).toBe(false);
    });
    test('测试切换语言按钮点击后，是否显示正常', () => {
        wrapper.find('.header-langBtn').simulate('click');
        expect(wrapper.find('.icon-enType').exists()).toBe(true);
    });
    test('测试搜索按钮点击后，showSearch是否被修改为true', () => {
        wrapper.find('.header-searchBtn').simulate('click');
        expect(wrapper.find('.test-hide').text()).toBe('showSearch:true;');
    });
});
