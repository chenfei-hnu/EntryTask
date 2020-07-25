import React from 'react';
import { RouteComponentProps } from '@reach/router';
import useAuth from '@context/auth';
import { ITab } from '@reducers/eventList';
import TabList from '@components/common/TabList';
import EventList from '@common/EventList';
import useEvents from '@context/events';
import './Setting.module.less';

export default function Setting(_: RouteComponentProps) {
    //登陆态信息
    const {
        state: { user },
    } = useAuth();
    //列表请求分页参数
    const {
        state: { page },
    } = useEvents();

    //设置页面我的相关活动信息tabs项数据
    const tabsData: ITab[] = [
        {
            type: 'Likes',
            icon: 'like',
            count: (user && user.likes_count) || 0,
            flex: 1,
        },
        {
            type: 'Going',
            icon: 'check',
            count: (user && user.goings_count) || 0,
            flex: 1,
        },
        {
            type: 'Past',
            icon: 'past',
            count: (user && user.past_count) || 0,
            flex: 1,
        },
    ];

    //为了规避设置页面和首页切换过程，请求参数来不及初始化而使用错误的请求参数问题，当判断请求参数已经初始化后，再加载无限列表请求数据
    const [paramInitd, setParamInitd] = React.useState<boolean>(false);
    React.useEffect(() => {
        if (page === 0) {
            setParamInitd(true);
        }
    }, [page]);

    return (
        <div className="settings-page">
            <div className="page-content">
                <div className={`setting-topContainer`}>
                    <div className={`setting-avatar`}>
                        <img
                            loading={'lazy'}
                            src={(user && user.avatar) || ''}
                            className={`setting-userImg`}
                            alt={(user && user.username) || ''}
                        />
                    </div>
                    <div className={`setting-username`}>
                        {user && user.username}
                    </div>
                    <div className={`setting-email`}>
                        <i className={`icon-email`}>{user && user.email}</i>
                    </div>
                </div>
                <div className={`setting-middleContainer`}>
                    <TabList data={tabsData} />
                </div>
                <div className={`setting-bottomContainer`}>
                    {paramInitd ? <EventList isSettingEvents={true} /> : null}
                </div>
            </div>
        </div>
    );
}
