import React from "react";
import { mount } from "enzyme";
import { AuthProvider } from "@context/auth";
import Login from "./Login";


const setup = () => {
    return mount(
        <AuthProvider >
            <Login></Login>
        </AuthProvider >
    );
};
describe("Login Test", () => {
    const wrapper = setup();
    test("测试是否在英文状态下正常渲染", () => {
        expect(wrapper.find('.login-bottomButton').exists()).toBe(true);
        expect(wrapper.find('.login-subtitle').text()).toBe('BLACK CAT');
    });
    test("测试提交按钮点击handleSubmit被调用", () => {
        wrapper.find('.login-bottomButton').simulate('click');
        expect(wrapper.find('.test-hide').text()).toBe('username:;password:;loading:true;isAuthenticated:false;langType:en;user.id:null;');
    });
});

