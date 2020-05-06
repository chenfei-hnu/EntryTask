import React from "react";
import { mount } from "enzyme";
import ListErrors from "./ListErrors";


const setup = (errors) => {
    return mount(
        <ListErrors errors={errors}></ListErrors>
    );
};
describe("ListErrors Test", () => {

    test("测试string参数情况下是否渲染正常", () => {
        const wrapper = setup('error');
        expect(wrapper.find('.error-messages').html()).toBe('<ul class=\"error-messages\"><li>error</li></ul>');
    });

    test("测试Errors参数情况下是否渲染正常", () => {
        const wrapper = setup({ 'key': ['values'] });
        expect(wrapper.find('.error-messages').html()).toBe('<ul class=\"error-messages\"><li>key values</li></ul>');
    });
});

