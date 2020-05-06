import { Event, User, Comment } from '@Types';
import { ITab } from './eventList';

export type EventDetailAction =
  | { type: 'SET_TAB'; tab: ITab }
  | { type: 'SET_SHOWCOMMENT'; showComment: boolean }

  | { type: 'UPDATE_EVENT', payload: { event: Event }; }
  | { type: 'FETCH_EVENT_BEGIN' }
  | {
    type: 'FETCH_EVENT_SUCCESS';
    payload: { event: Event };
  }
  | { type: 'FETCH_EVENT_ERROR'; error: string }

  | { type: 'FETCH_LIKES_BEGIN' }
  | {
    type: 'FETCH_LIKES_SUCCESS';
    payload: { users: User[] };
  }
  | { type: 'FETCH_LIKES_ERROR'; error: string }

  | { type: 'FETCH_GOING_BEGIN' }
  | {
    type: 'FETCH_GOING_SUCCESS';
    payload: { users: User[] };
  }
  | { type: 'FETCH_GOING_ERROR'; error: string }


  | { type: 'FETCH_COMMENTS_BEGIN' }
  | {
    type: 'FETCH_COMMENTS_SUCCESS';
    payload: { comments: Comment[] };
  }
  | { type: 'FETCH_COMMENTS_ERROR'; error: string };


export interface EventDetailState {
  selectedTab: ITab | null;
  showComment: boolean;

  event: Event | null;
  eventLoading: boolean;
  eventError: string | null;

  likedUsers: User[];
  likedUsersLoading: boolean;
  likedUsersError: string | null;

  goingUsers: User[];
  goingUsersLoading: boolean;
  goingUsersError: string | null;

  comments: Comment[];
  commentsLoading: boolean;
  commentsError: string | null;
}

export const initialState: EventDetailState = {
  selectedTab: { type: 'Details', icon: 'info', flex: 1 },
  showComment: false,

  event: null,
  eventLoading: false,
  eventError: null,

  likedUsers: [],
  likedUsersLoading: false,
  likedUsersError: null,

  goingUsers: [],
  goingUsersLoading: false,
  goingUsersError: null,

  comments: [],
  commentsLoading: false,
  commentsError: null,
};
export function eventDetailReducer(
  state: EventDetailState,
  action: EventDetailAction,
): EventDetailState {
  switch (action.type) {
    case 'SET_TAB'://保存设置页面激活项
      return {
        ...state,
        selectedTab: action.tab,
      };
    case 'SET_SHOWCOMMENT'://设置是否显示顶部的评论表单区域
      return {
        ...state,
        showComment: action.showComment,
      };
    case 'UPDATE_EVENT'://更新当前活动的部分属性
      return {
        ...state,
        event: action.payload.event,
      };
    case 'FETCH_EVENT_BEGIN'://开始请求活动详情
      return {
        ...state,
        eventLoading: true,
        eventError: null,
      };
    case 'FETCH_EVENT_SUCCESS'://活动详情请求成功
      return {
        ...state,
        eventLoading: false,
        event: action.payload.event,
      };
    case 'FETCH_EVENT_ERROR'://活动详情请求失败
      return {
        ...state,
        eventLoading: false,
        eventError: action.error,
        event: null,
      };
    case 'FETCH_LIKES_BEGIN'://开始请求活动关注用户列表
      return {
        ...state,
        likedUsersLoading: true,
        likedUsersError: null,
      };
    case 'FETCH_LIKES_SUCCESS'://活动关注用户列表请求成功
      return {
        ...state,
        likedUsersLoading: false,
        likedUsers: action.payload.users,
      };
    case 'FETCH_LIKES_ERROR'://活动关注用户列表请求失败
      return {
        ...state,
        likedUsersLoading: false,
        likedUsersError: action.error,
        likedUsers: [],
      };
    case 'FETCH_GOING_BEGIN'://开始请求活动参与用户列表
      return {
        ...state,
        goingUsersLoading: true,
        goingUsersError: null,
      };
    case 'FETCH_GOING_SUCCESS'://活动参与用户列表请求成功
      return {
        ...state,
        goingUsersLoading: false,
        goingUsers: action.payload.users,
      };
    case 'FETCH_GOING_ERROR'://活动参与用户列表请求失败
      return {
        ...state,
        goingUsersLoading: false,
        goingUsersError: action.error,
        goingUsers: [],
      };
    case 'FETCH_COMMENTS_BEGIN'://开始请求活动评论
      return {
        ...state,
        commentsLoading: true,
        commentsError: null,
      };
    case 'FETCH_COMMENTS_SUCCESS'://活动评论请求成功
      return {
        ...state,
        commentsLoading: false,
        comments: action.payload.comments,
      };
    case 'FETCH_COMMENTS_ERROR'://活动评论请求失败
      return {
        ...state,
        commentsLoading: false,
        commentsError: action.error,
        comments: [],
      };
    default:
      return state;
  }
}
