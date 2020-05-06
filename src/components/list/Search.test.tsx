import React from "react";
import { mount } from "enzyme";
import { EventProvider } from "@context/events";
import { AuthProvider } from "@context/auth";
import Search from "./Search.module";

const setup = () => {
    return mount(
        <AuthProvider>
            <EventProvider >
                <Search ></Search>
            </EventProvider >
        </AuthProvider>
    );
};
describe("Search Test", () => {
    const wrapper = setup();
    test("测试是否渲染正常", () => {
        expect(wrapper.find('.search-searchContent').exists()).toBe(true);
    });
    test("测试选中日期项later", () => {
        wrapper.find('.search-dateItem span').last().simulate('click');
        expect(wrapper.find('.search-active span').first().text()).toBe("  LATER");
    });
    test("测试点击搜索", () => {
        wrapper.find('.search-bottomButton').simulate('click');
        expect(wrapper.find('.test-hide').text()).toBe("showSearch:false;");
    });
});

