import React from 'react';
import EventPreview from './EventPreview';
import { ITab } from '@reducers/eventList';
import useAuth from '@context/auth';
import { Event } from '@Types';
import { useEventListener, throttle, langFormat } from '@Utils';
import './EventList.module.less';
import {
  getEventsByLike,
  getEventsByGoing,
  getEventsByPast,
  getEvents
} from '@api/EventsAPI';
import useEvents from '@context/events';

//无限列表的参数，判断父组件为首页还是设置页面
type EventListProps = {
  isSettingEvents?: boolean;
};

//设置页面对应的3种请求接口映射
const loadUserEvents = (uid: number, tab: ITab | null, page = 0) => {
  switch (tab && tab.type) {
    case 'Likes':
      return getEventsByLike(uid, page);
    case 'Going':
      return getEventsByGoing(uid, page);
    case 'Past':
      return getEventsByPast(uid, page);
    default:
      return getEventsByLike(uid, page);
  }
};

//首页对应的数据请求接口
const loadEvents = (page = 0, after: number, before: number, channels: string) => {
  return getEvents(page, after, before, channels);
};


export default function EventList({ isSettingEvents }: EventListProps) {
  //无限列表请求相关的参数及搜索条件信息
  const {
    state: { loading, searchDesc, selectedTab, page, after, before, channels, currentIndex },
    dispatch,
  } = useEvents();

  //用户登陆态及当前系统语言
  const {
    state: { user, langType },
  } = useAuth();

  const [viewList, setViewList] = React.useState<Event[]>([]);//所有已经请求到的event数据列表,并根据此变量进行列表展示
  const [shouldAddIndex, setShouldAddIndex] = React.useState<number>(10);//后续应该请求下一个分页数据的列表项序号，滚动到此位置便加载缓存数据或请求下一个分页的数据
  const [totalEvent, setTotalEvent] = React.useState<number>(Number.MAX_VALUE);//当前列表的最大数量，达到最大数量后不再请求后面分页的数据

  const [inited, setInited] = React.useState<boolean>(false);//初次渲染过后，search中条件变化触发响应的useEffect更新数据
  const [searchDescVisibile, setSearchDescVisibile] = React.useState<boolean>(false);//search中条件变化后显示顶部条件描述
  const [shouldReload, setShouldReload] = React.useState<boolean>(true);//根基其他非滚动位置数据状态变化，判断是否应该刷新列表，比如搜索参数变更等

  const headerHeight = document.documentElement.clientHeight * 0.07;//顶部导航栏高度
  const searchDescHeight = searchDescVisibile ? 66 : 0;//搜索条件信息高度
  const settingUserInfoHeight = isSettingEvents ? (document.documentElement.clientHeight * 0.6) : 0;//设置页面用户信息高度
  const topTotalHeight = searchDescHeight + settingUserInfoHeight + headerHeight;//无限列表顶部其他元素高度

  const eventItemHeight = 236;//单个事件显示区域的总高度为236px;
  const limit = 20;//每次请求的数据条数

  //使用防抖函数监听滚动事件，设置当前滚动位置对应的列表项序号
  const scrollListen = () => {
    const index = Math.floor((window.scrollY - topTotalHeight) / eventItemHeight);
    dispatch({ type: 'SET_INDEX', currentIndex: index });
  };
  useEventListener('scroll', throttle(scrollListen, 200));

  //隐藏搜索描述信息并切换搜索状态标示，以触发search组件的重置搜索条件操作，更新列表数据
  const clearSearch = () => {
    setSearchDescVisibile(false);
    dispatch({ type: 'SET_SEARCHSTATUS' });
  };

  //当滚动位置发生变化或者其他相关条件变化需要刷新时，判断是否进行数据获取
  React.useEffect(() => {
    async function fetchUserEvents() {
      dispatch({ type: 'FETCH_EVENTS_BEGIN' });
      try {
        const payload = await loadUserEvents(user && user.id || -1, selectedTab, page);
        dispatch({ type: 'FETCH_EVENTS_SUCCESS', payload: payload.data });
        return payload.data.events;
      } catch (error) {
        dispatch({ type: 'FETCH_EVENTS_ERROR', error });
        return [];
      }
    }
    async function fetchEvents() {
      dispatch({ type: 'FETCH_EVENTS_BEGIN' });
      try {
        const payload = await loadEvents(page, after, before, channels);
        dispatch({ type: 'FETCH_EVENTS_SUCCESS', payload: payload.data });
        return payload.data.events;
      } catch (error) {
        dispatch({ type: 'FETCH_EVENTS_ERROR', error });
        return [];
      }
    }
    function requestCommonEvent() {
      if (isSettingEvents) {
        return fetchUserEvents();
      } else {
        return fetchEvents();
      }
    }
    const handleNextView = async () => {
      if (!loading && viewList.length < totalEvent) {
        const result = await requestCommonEvent();
        if (result.length) {//还有下一个分页的数据

          dispatch({ type: 'SET_PAGE', page: page + 1 });
          if (viewList.length > 0) {
            setShouldAddIndex(shouldAddIndex + limit);
          }
          for (let index = 0; index < result.length; index++) {
            result[index].index = viewList.length + index;
          }
          setViewList(viewList.concat(result));
        }
        setInited(true);
        setShouldReload(false);
        if (result.length !== limit) {//没有下一个分页的数据
          setTotalEvent(totalEvent + result.length);
        }
      }
    };
    if (shouldReload || currentIndex > shouldAddIndex) {
      handleNextView();
    }
    return () => {
    };
  }, [currentIndex, shouldReload]);

  //初次渲染后，判断搜索条件发生变化时，显示搜索描述信息，重置请求参数更新列表数据
  React.useEffect(() => {
    if (inited && !isSettingEvents) {
      setViewList([]);
      setShouldAddIndex(10);
      setTotalEvent(Number.MAX_VALUE);
      if (searchDesc.text) {
        setSearchDescVisibile(true);
      }
      dispatch({ type: 'SET_PAGE', page: 0 });
      dispatch({ type: 'SET_INDEX', currentIndex: 0 });
      setShouldReload(true);
    }
  }, [after, before, channels]);

  //当前系统语言切换时，需重新设置搜索描述信息参数更新文本
  React.useEffect(() => {
    dispatch({
      type: 'SET_SEARCHDESC', searchDesc: {
        tpl: searchDesc.tpl,
        args: searchDesc.args,
        text: `${langFormat(langType, searchDesc.tpl, searchDesc.args)}`
      }
    });
  }, [langType]);

  //设置页面切换tab重置参数并刷新
  React.useEffect(() => {
    if (inited && isSettingEvents) {
      setViewList([]);
      setShouldAddIndex(10);
      setTotalEvent(Number.MAX_VALUE);
      dispatch({ type: 'SET_PAGE', page: 0 });
      dispatch({ type: 'SET_INDEX', currentIndex: 0 });
      setShouldReload(true);
    }
  }, [selectedTab]);

  //退出页面时重置请求参数
  React.useEffect(() => {
    return () => {
      dispatch({ type: 'RECOVER_DEFAULT' });
    };
  }, []);

  const searchDescEl = !isSettingEvents ? (<div className={`eventList-searchDesc`}>
    <div className={`eventList-searchTop`}>
      <div className={`eventList-leftText`}>
        {`${langFormat(langType, 'Search Results')}`}
      </div>
      <button
        className={`btn btn-lg btn-primary eventList-clearButton`}
        onClick={clearSearch}
      >  {`${langFormat(langType, 'CLEAR SEARCH')}`}</button>
    </div>
    <div className={`eventList-searchBottom`}>
      {`${langFormat(langType, 'Search for {0}', [searchDesc.text])}`}
    </div>
  </div>) : null;
  if (!loading && viewList.length === 0) {
    return <React.Fragment>
      {searchDescEl}
      <div className={`eventList-eventListContainer`}>
        <div className={`eventList-emptyEvents`}>
          <i className={`icon-no-activity`}></i>
          <p>{`${langFormat(langType, 'No activity found')}`}</p>
        </div>
      </div>
    </React.Fragment>;
  }

  return (
    <React.Fragment>
      {
        searchDescVisibile ? searchDescEl : null
      }
      <div className={`eventList-eventListContainer`} >
        {viewList.map((event) => (
          <EventPreview
            key={event.id}
            top={event.index * eventItemHeight + topTotalHeight}
            event={event}
            selectedTab={selectedTab}
          />
        ))}
        {
          loading ? <div className={`eventList-loading`}>{`${langFormat(langType, 'Loading...')}`}</div> : null
        }
      </div>
    </React.Fragment >
  );
}
