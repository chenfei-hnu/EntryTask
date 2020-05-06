import React from "react";
import { mount } from "enzyme";
import { EventProvider } from "@context/events";
import List from "./List";

const setup = () => {
    return mount(
        <EventProvider >
            <List></List>
        </EventProvider >
    );
};
describe("List Test", () => {
    const wrapper = setup();
    test("测试是否渲染正常", () => {
        expect(wrapper.find('.list-rightEmpty').exists()).toBe(true);
    });
    test("测试点击事件是否触发", () => {
        wrapper.find('.list-rightEmpty').last().simulate('click');
        expect(wrapper.find('.list-hide').exists()).toBe(true);
    });
});

