import React from "react";
import { mount } from "enzyme";
import UsersList from "./UsersList";
import { User } from "@Types";
const users: User[] = [];
for (let i = 0; i < 7; i++) {
    users.push({
        "id": i,
        "username": "Jinyang.Li",
        "email": "test@gmail.com",
        "likes_count": 0,
        "goings_count": 0,
        "past_count": 0,
        "avatar": `https://coding.net/static/fruit_avatar/Fruit-19.png?${i}`,
    });
}
const setup = () => {
    const icon = 'icon-check-outline';
    const count = 0;
    const text = 'going';
    return mount(
        <UsersList icon={icon} text={text} count={count} users={users}></UsersList>
    );
};
describe("UsersList Test", () => {
    let wrapper = setup();
    test("测试是否渲染正常", () => {
        expect(wrapper.find('.userList-statusInfo').exists()).toBe(true);
    });
    test("测试显示展开按钮", () => {
        expect(wrapper.find('.userList-down').exists()).toBe(false);
        users.push({
            "id": 8,
            "username": "Jinyang.Li",
            "email": "test@gmail.com",
            "likes_count": 0,
            "goings_count": 0,
            "past_count": 0,
            "avatar": "https://coding.net/static/fruit_avatar/Fruit-19.png",
        });
        wrapper = setup();
        expect(wrapper.find('.userList-down').exists()).toBe(true);
        expect(wrapper.find('img').length).toBe(6);
        wrapper.find('.userList-down').last().simulate('click');
        expect(wrapper.find('img').length).toBe(8);
    });
});

