import React from "react";
import { mount } from "enzyme";
import EventPreview from "./EventPreview";
import { ITab } from "@reducers/eventList";


/* 
event,
selectedTab,
top, 
*/
const event = {
    "id": 1,
    "name": "Activity Title Name Make it Longer May Longer than One Line",
    "creator_id": 9,
    "channel_id": 3,
    "begin_time": "2020-04-27T09:39:38.403Z",
    "end_time": "2020-04-28T09:39:38.403Z",
    "create_time": "2020-04-27T09:39:38.403Z",
    "update_time": "2020-04-27T09:39:38.403Z",
    "location": "Marina Bay Sands",
    "location_detail": "10 Bayfront Ave, S018956",
    "description": "[No longer than 300 chars] Vivamus sagittis, diam in lobortis, sapien arcu mattis erat, vel aliquet sem urna et risus. Ut feugiat sapien mi potenti. Maecenas et enim odio. Nullam massa metus, varius quis vehicula sed, pharetra mollis erat. In quis viverra velit. Vivamus placerat, est nec hendrerit varius, enim dui hendrerit magna, ut pulvinar nibh lorem vel lacus. Mauris a orci iaculis, hendrerit eros sed, gravida leo. In dictum mauris vel augue varius there is south north asim.",
    "createdAt": "2020-04-27T09:39:38.404Z",
    "updatedAt": "2020-04-27T09:39:38.404Z",
    "channel": {
        "id": 3,
        "name": "Hiring",
        "createdAt": "2020-04-27T09:39:38.395Z",
        "updatedAt": "2020-04-27T09:39:38.395Z"
    },
    "creator": {
        "id": 9,
        "likes_count": 0, "goings_count": 0, "past_count": 0,
        "username": "user_6", "password": "df10ef8509dc176d733d59549e7dbfaf", "email": "user_6@example.com", "salt": "abc", "avatar": "https://coding.net/static/fruit_avatar/Fruit-7.png", "createdAt": "2020-04-27T09:39:38.398Z", "updatedAt": "2020-04-27T09:39:38.398Z"
    },
    "images": ["https://tse2-mm.cn.bing.net/th?id=OIP.w8XC0KPitDfMEeSv9P3GxgHaEt&w=248&h=160&c=7&o=5&dpr=2&pid=1.7", "https://tse2-mm.cn.bing.net/th?id=OIP.B7gjATIkLyifGdknxysjVwHaFj&w=222&h=167&c=7&o=5&dpr=2&pid=1.7", "https://tse2-mm.cn.bing.net/th?id=OIP.NI9vpiDmGzrQLPKq23e2_wHaFj&w=234&h=173&c=7&o=5&dpr=2&pid=1.7", "https://tse2-mm.cn.bing.net/th?id=OIP.rzUYVz0YoOqkmoehDQcKRgHaEo&w=295&h=181&c=7&o=5&dpr=2&pid=1.7", "https://tse2-mm.cn.bing.net/th?id=OIP.wTqIPNLDZ96_gPsHc-pplQHaFI&w=228&h=160&c=7&o=5&dpr=2&pid=1.7"],
    "likes_count": 12,
    "goings_count": 12,
    "me_likes": true,
    "me_going": true,
    "index": 0
};
const setup = (event) => {

    const selectedTab: ITab = { type: 'Likes', icon: 'like', count: 0, flex: 1 };
    const top = 40;
    return mount(
        <EventPreview selectedTab={selectedTab} event={event} top={top}></EventPreview>
    );
};
describe("EventPreview Test", () => {

    test("测试当前index范围内的活动是否能正常显示", () => {
        const wrapper = setup(event);
        expect(wrapper.find('.eventPreview-eventItem').exists()).toBe(true);
    });
    test("测试有图片的活动是否显示正常", () => {
        const wrapper = setup(event);
        expect(wrapper.find('.eventPreview-eventImg').exists()).toBe(true);
        expect(wrapper.find('.icon-time').text()).toBe('27 Apr 2020 - 28 Apr 2020');
    });
    test("测试没有图片的活动是否显示正常", () => {
        event.images = [];
        const wrapper = setup(event);
        expect(wrapper.find('.eventPreview-eventImg').exists()).toBe(false);
        expect(wrapper.find('.icon-time').text()).toBe('27 Apr 2020 17:39 - 28 Apr 2020 17:39');
    });
    test("测试当前index范围外的活动是否没有显示", () => {
        event.index = 20;
        const wrapper = setup(event);
        expect(wrapper.find('.eventPreview-eventItem').exists()).toBe(false);
    });
});

