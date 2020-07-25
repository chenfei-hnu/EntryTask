import React from 'react';
import { ITab, EventListAction } from '@reducers/eventList';
import './EventPreview.module.less';
import { Event } from '@Types';
import { sliceDate, langFormat } from '@Utils';
import useEvents from '@context/events';
import { Link } from '@reach/router';
import useAuth from '@context/auth';

//列表项组件渲染所需的参数
type EventPreviewProps = {
    event: Event; //当前活动对象
    top: number; //绝对定位的top参数
    selectedTab: ITab; //设置页面当前选择的tabs激活项
};

export default function EventPreview({
    event,
    selectedTab,
    top,
}: EventPreviewProps) {
    //滚动位置对应的列表项需要，根据此参数判断是否显示当前列表项
    const {
        state: { currentIndex },
    } = useEvents();

    //当前系统语言
    const {
        state: { langType },
    } = useAuth();

    //因为服务端数据有误，前端根据当前选择的tabs激活项，设置相应参与和点赞状态
    const tabsData: ITab[] = [
        {
            type: 'Going',
            icon: 'check',
            count: (event && event.goings_count) || 0,
            me: event.me_going,
            meText: langFormat(langType, 'I am going!'),
            flex: 1,
        },
        {
            type: 'Likes',
            icon: 'like',
            count: (event && event.likes_count) || 0,
            me: event.me_likes,
            meText: langFormat(langType, 'I like it'),
            flex: 1,
        },
    ];
    if (selectedTab && selectedTab.type === 'Going') {
        tabsData[0].me = true;
    } else if (selectedTab && selectedTab.type === 'Likes') {
        tabsData[1].me = true;
    }

    //无限列表仅显示当前滚动位置对应的列表项附近20条记录
    if (event.index > currentIndex + 10 || event.index < currentIndex - 10) {
        return null;
    }
    return (
        <div className={`eventPreview-eventItem`} style={{ top: `${top}px` }}>
            <Link to={`/detail/${event.id}`}>
                <div className={`eventPreview-creatorChannel`}>
                    <div className={`eventPreview-creatorInfo`}>
                        <img
                            loading={'lazy'}
                            src={(event.creator && event.creator.avatar) || ''}
                            className={`eventPreview-userImg`}
                            alt={
                                (event.creator && event.creator.username) || ''
                            }
                        />
                        <span className={`eventPreview-username`}>
                            {event.creator.username}
                        </span>
                    </div>
                    <div className={`eventPreview-channel`}>
                        {' '}
                        {event.channel.name}
                    </div>
                </div>
                <div className={`eventPreview-centerInfo`}>
                    <div className={`eventPreview-centerLeftInfo`}>
                        <div className={`eventPreview-eventName`}>
                            {event.name}
                        </div>
                        <div className={`eventPreview-timeInfo`}>
                            {event.images ? (
                                <i className={`icon-time`}>{`${sliceDate(
                                    event && event.begin_time,
                                    event &&
                                        event.images &&
                                        event.images.length > 0
                                )} - ${sliceDate(
                                    event && event.end_time,
                                    event &&
                                        event.images &&
                                        event.images.length > 0
                                )}`}</i>
                            ) : (
                                <i className={`icon-time`}>{`${sliceDate(
                                    event && event.begin_time,
                                    false
                                )} - ${sliceDate(
                                    event && event.end_time,
                                    false
                                )}`}</i>
                            )}
                        </div>
                    </div>
                    {event.images && event.images.length ? (
                        <div className={`eventPreview-centerRightInfo`}>
                            <img
                                loading={'lazy'}
                                src={event.images[0] || ''}
                                className={`eventPreview-eventImg`}
                                alt={event.name || ''}
                            />
                        </div>
                    ) : null}
                </div>
                <div className={`eventPreview-desc`}>{event.description}</div>
                <div className={`eventPreview-status`}>
                    {tabsData.map((tab) => (
                        <div
                            key={tab.type}
                            className={`eventPreview-statusItem ${
                                tab.me ? 'activeStatus' : ''
                            }`}
                        >
                            {tab.me ? (
                                <i
                                    className={`icon-${tab.icon}`}
                                >{`${tab.meText}`}</i>
                            ) : (
                                <i className={`icon-${tab.icon}-outline`}>{`${
                                    tab.count
                                } ${langFormat(langType, tab.type)}`}</i>
                            )}
                        </div>
                    ))}
                </div>
            </Link>
        </div>
    );
}
