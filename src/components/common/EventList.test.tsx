import React from "react";
import { mount } from "enzyme";
import EventList from "./EventList";


const setup = (isSettingEvents) => {

    return mount(
        <EventList isSettingEvents={isSettingEvents}></EventList>
    );
};
describe("EventList Test", () => {
    test("测试EventList正常渲染", async () => {
        const wrapper = setup(true);
        expect(wrapper.find('.eventList-eventListContainer').exists()).toBe(true);
    });
});

