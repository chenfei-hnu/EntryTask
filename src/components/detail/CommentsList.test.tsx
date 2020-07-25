import React from 'react';
import { mount } from 'enzyme';
import { EventDetailProvider } from '@context/eventDetail';
import { AuthProvider } from '@context/auth';
import CommentsList from './CommentsList';
import { Comment, User } from '@Types';

const setup = () => {
    const user: User = {
        id: 11,
        username: 'user_8',
        email: 'user_8@example.com',
        likes_count: 0,
        goings_count: 0,
        past_count: 0,
        avatar: 'https://coding.net/static/fruit_avatar/Fruit-9.png',
    };
    const comments: Comment[] = [];
    for (let i = 0; i < 20; i++) {
        comments.push({
            id: i,
            event: null,
            comment: 'test1',
            create_time: new Date('2020-04-27T09:39:38.512Z'),
            user,
        });
    }
    return mount(
        <AuthProvider>
            <EventDetailProvider>
                <CommentsList comments={comments}></CommentsList>
            </EventDetailProvider>
        </AuthProvider>
    );
};
describe('CommentsList Test', () => {
    const wrapper = setup();
    test('测试是否渲染正常', () => {
        expect(wrapper.find('.commonsList-commentItem').exists()).toBe(true);
    });
    test('测试点击事件是否触发', () => {
        window.scrollTo = jest.fn();
        wrapper.find('.commonsList-right').last().simulate('click');
        expect(wrapper.find('.test-hide').text()).toBe('showComment:true;');
    });
});
