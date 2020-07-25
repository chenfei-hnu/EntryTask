import { Event, SearchDesc } from '@Types';
import { getDate } from '@Utils';

export type EventListAction =
    | { type: 'FETCH_EVENTS_BEGIN' }
    | { type: 'RECOVER_DEFAULT' }
    | {
          type: 'FETCH_EVENTS_SUCCESS';
          payload: { events: Event[] };
      }
    | { type: 'FETCH_EVENTS_ERROR'; error: string }
    | { type: 'SET_TAB'; tab: ITab }
    | { type: 'SET_SHOWSEARCH'; showSearch: boolean }
    | { type: 'SET_BEFORE'; before: number }
    | { type: 'SET_TEMPBEFORE'; tempBefore: number }
    | { type: 'SET_AFTER'; after: number }
    | { type: 'SET_TEMPAFTER'; tempAfter: number }
    | { type: 'SET_CHANNELS'; channels: string }
    | { type: 'SET_INDEX'; currentIndex: number }
    | { type: 'SET_SEARCHDESC'; searchDesc: SearchDesc }
    | { type: 'SET_SEARCHSTATUS' }
    | { type: 'SET_PAGE'; page: number };

export type ITab =
    | {
          type: 'Likes';
          icon: 'like';
          count: number;
          me?: boolean;
          meText?: string;
          flex: 1;
      }
    | {
          type: 'Going';
          icon: 'check';
          count: number;
          me?: boolean;
          meText?: string;
          flex: 1;
      }
    | {
          type: 'Past';
          icon: 'past';
          count: number;
          me?: boolean;
          meText?: '';
          flex: 1;
      }
    | {
          type: 'Details';
          icon: 'info';
          count?: number;
          me?: boolean;
          meText?: '';
          flex: 1;
      }
    | {
          type: 'Participants';
          icon: 'people';
          count?: number;
          me?: boolean;
          meText?: '';
          flex: 1.3 | 1;
      }
    | {
          type: 'Commens';
          icon: 'comment';
          count?: number;
          me?: boolean;
          meText?: '';
          flex: 1;
      };

export interface EventListState {
    events: Event[];
    loading: boolean;
    error: string | null;
    selectedTab: ITab;
    currentIndex: number;
    after: number;
    before: number;
    tempBefore: number;
    tempAfter: number;
    channels: string;
    page: number;
    searchDesc: SearchDesc;
    searchStatus: boolean;
    showSearch: boolean;
}

export const initialState: EventListState = {
    events: [],
    loading: false,
    error: null,
    currentIndex: 0,
    selectedTab: { type: 'Likes', icon: 'like', count: 0, flex: 1 },
    after: getDate(-100),
    before: getDate(100),
    tempAfter: getDate(-100),
    tempBefore: getDate(100),
    searchDesc: {
        tpl: '',
        args: [],
        text: '',
    },
    channels: '',
    showSearch: false,
    searchStatus: false,
    page: 0,
};
export function eventsReducer(
    state: EventListState,
    action: EventListAction
): EventListState {
    switch (action.type) {
        case 'RECOVER_DEFAULT': //重置请求参数
            return initialState;
        case 'SET_SEARCHSTATUS': //设置搜索组件显示情况
            return {
                ...state,
                searchStatus: !state.searchStatus,
            };
        case 'FETCH_EVENTS_BEGIN': //开始请求活动列表
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'FETCH_EVENTS_SUCCESS': //请求活动列表成功
            return {
                ...state,
                loading: false,
                events: action.payload.events,
            };
        case 'FETCH_EVENTS_ERROR': //请求活动列表失败
            return {
                ...state,
                loading: false,
                error: action.error,
                events: [],
            };
        case 'SET_TAB': //保存设置页面激活项
            return {
                ...state,
                selectedTab: action.tab,
            };
        case 'SET_SEARCHDESC': //设置列表页面显示的搜索条件描述
            return {
                ...state,
                searchDesc: action.searchDesc,
            };
        case 'SET_TEMPBEFORE': //设置用户临时选择的搜索时间before
            return {
                ...state,
                tempBefore: action.tempBefore,
            };
        case 'SET_AFTER': //设置搜索时间after
            return {
                ...state,
                after: action.after,
            };
        case 'SET_TEMPAFTER': //设置用户临时选择的搜索时间after
            return {
                ...state,
                tempAfter: action.tempAfter,
            };
        case 'SET_BEFORE': //设置搜索时间before
            return {
                ...state,
                before: action.before,
            };

        case 'SET_SHOWSEARCH': //设置列表页面搜索描述显示情况
            return {
                ...state,
                showSearch: action.showSearch,
            };
        case 'SET_INDEX': //设置滚动位置对应的列表项序号
            return {
                ...state,
                currentIndex: action.currentIndex,
            };
        case 'SET_CHANNELS': //设置搜索频道
            return {
                ...state,
                channels: action.channels,
            };
        case 'SET_PAGE': //设置活动列表请求的分页参数
            return {
                ...state,
                page: action.page,
            };
        default:
            return state;
    }
}
