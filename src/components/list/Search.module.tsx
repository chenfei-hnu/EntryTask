import './Search.module.less';
import { Channel, TDate, SearchDesc, Postition } from '@Types';
import { getDate, dateFormat, langFormat } from '@Utils';
import 'antd-mobile/lib/popover/style/css';
import Popover from './Popover.module';
import useEvents from '@context/events';
import { getChannels } from '@api/ChannelsAPI';
import React, { SyntheticEvent } from 'react';
import useAuth from '@context/auth';


export default function Search() {
    //未点击搜索前，选择的临时时间范围，以及首页需要显示的搜索描述信息
    const {
        state: { tempBefore, tempAfter, searchStatus, showSearch },
        dispatch,
    } = useEvents();

    //当前系统语言
    const {
        state: { langType },
    } = useAuth();

    //全部频道的数据对应，用useState保存以便后续勾选去勾选时用includes判断
    const [allChannel, setAllChannel] = React.useState<Channel>({ id: 0, name: langFormat(langType, 'all') || '' });
    //所有可选频道
    const [channels, setChannels] = React.useState<Channel[]>([allChannel]);
    //当前已经勾选的频道项
    const [selectChannels, setSelectChannels] = React.useState<Channel[]>([allChannel]);
    //当权选择的时间范围项
    const [activeDateItem, setActiveDateItem] = React.useState<string>('anytime');
    //after项对应的时间范围选择组件是否显示
    const [dateRangeVisible, setDateRangeVisible] = React.useState<boolean>(false);
    //搜索侧边页面下方单行显示的搜索描述信息
    const [searchDesc, setSearchDesc] = React.useState<SearchDesc>({
        tpl: 'Channel All activities anytime',
        args: [],
        text: `${langFormat(langType, 'Channel All activities anytime')}`
    });
    //首页上方可多行显示的搜索描述信息
    const [totalSearchDesc, setTotalSearchDesc] = React.useState<SearchDesc>({
        tpl: 'Channel All activities anytime',
        args: [],
        text: `${langFormat(langType, 'Channel All activities anytime')}`
    });
    const [inited, setInited] = React.useState<boolean>(false);//初次渲染过后，clearSearch触发响应的useEffect更新数据，修改popover组件修改tempBefore参数更新搜索描述信息
    const [laterPosition, setLaterPosition] = React.useState<Postition>({ x: 0, y: 0 });//later时间范围项的位置

    //可以选择的时间类型数据
    const dateTags: TDate[] = [{
        type: 'anytime',
        name: `${langFormat(langType, 'anytime')}`,
        after: getDate(-100),
        before: getDate(100),
    }, {
        type: 'today',
        name: `${langFormat(langType, 'today')}`,
        after: getDate(0),
        before: getDate(1),
    }, {
        type: 'tomorrow',
        name: `${langFormat(langType, 'tomorrow')}`,
        after: getDate(1),
        before: getDate(2),
    }, {
        type: 'next 7 days',
        name: `${langFormat(langType, 'next 7 days')}`,
        after: getDate(0),
        before: getDate(7),
    }, {
        type: 'next 30 days',
        name: `${langFormat(langType, 'next 30 days')}`,
        after: getDate(0),
        before: getDate(30),
    }, {
        type: 'later',
        name: `${langFormat(langType, 'later')}`,
        after: getDate(0),
        before: getDate(1),
    }];

    //选择某一项时间类型的处理函数
    const selectTime = (item: TDate) => {
        setActiveDateItem(item.type);
        dispatch({ type: 'SET_TEMPAFTER', tempAfter: item.after });
        dispatch({ type: 'SET_TEMPBEFORE', tempBefore: item.before });
        if (item.type === 'later') {
            setDateRangeVisible(true);
        } else {
            setDateRangeVisible(false);
        }
    };

    //选择频道项的处理函数
    const selectChannel = (item: Channel) => {
        if (item.id) {
            if (selectChannels.includes(item)) {
                let filteredArr = selectChannels.filter((arrItem) => {
                    return arrItem.id !== item.id && arrItem.id !== 0;
                });
                if (!filteredArr.length) {
                    filteredArr = [allChannel];
                }
                setSelectChannels(filteredArr);
            } else {
                const filteredArr = selectChannels.filter((arrItem) => {
                    return arrItem.id !== 0;
                });
                setSelectChannels(filteredArr.concat([item]));
            }
        } else {
            if (selectChannels.includes(allChannel)) {
            } else {
                setSelectChannels([item]);
            }

        }
    };
    //修改搜索条件后，需要更新搜索描述信息
    const changeSearchDesc = () => {
        if (activeDateItem === "anytime") {
            setSearchDesc(
                {
                    tpl: 'Channel {0} activities anytime',
                    args: [getSelectChannels('name')],
                    text: `${langFormat(langType, 'Channel {0} activities anytime', [getSelectChannels('name')])}`
                }
            );
            setTotalSearchDesc(
                {
                    tpl: 'Channel {0} activities anytime',
                    args: [getSelectChannels('name'), true],
                    text: `${langFormat(langType, 'Channel {0} activities anytime', [getSelectChannels('name', true)])}`
                }
            );
        } else {
            setSearchDesc(
                {
                    tpl: 'Channel {0} activities form {1} to {2}',
                    args: [getSelectChannels('name'), dateFormat('dd/mm', new Date(tempAfter)), dateFormat('dd/mm', new Date(tempBefore))],
                    text: `${langFormat(langType, 'Channel {0} activities form {1} to {2}', [getSelectChannels('name'), dateFormat('dd/mm', new Date(tempAfter)), dateFormat('dd/mm', new Date(tempBefore))])}`
                }
            );
            setTotalSearchDesc(
                {
                    tpl: 'Channel {0} activities form {1} to {2}',
                    args: [getSelectChannels('name', true), dateFormat('dd/mm', new Date(tempAfter)), dateFormat('dd/mm', new Date(tempBefore))],
                    text: `${langFormat(langType, 'Channel {0} activities form {1} to {2}', [getSelectChannels('name'), dateFormat('dd/mm', new Date(tempAfter)), dateFormat('dd/mm', new Date(tempBefore))])}`
                }
            );
        }
    };

    //获取所选频道的描述显示或者id参数
    const getSelectChannels = (type: 'name' | 'id', total?: boolean) => {
        if (type === 'name') {
            const nameArr = [];
            for (const item of selectChannels) {
                nameArr.push(item.name);
            }
            let joinStr = nameArr.join(',');
            if (!total) {
                if (joinStr.length > 8) {
                    joinStr = `${joinStr.slice(0, 8)}...`;
                }
            }
            return joinStr;
        } else {
            if (selectChannels.length === 1 && selectChannels[0].id === 0) {
                return '';
            }
            const idArr = [];
            for (const item of selectChannels) {
                idArr.push(item.id);
            }
            return idArr.join(',');
        }
    };
    //点击搜索按钮执行的处理函数
    const doSearch = () => {
        dispatch({ type: 'SET_AFTER', after: tempAfter });
        dispatch({ type: 'SET_BEFORE', before: tempBefore });
        dispatch({ type: 'SET_CHANNELS', channels: getSelectChannels('id') });
        dispatch({ type: 'SET_SHOWSEARCH', showSearch: false });
        dispatch({ type: 'SET_SEARCHDESC', searchDesc: totalSearchDesc });
    };


    //首页点击重置搜索条件触发的处理函数，重置搜索条件及搜索侧边页面显示
    const clearSearch = () => {
        dispatch({ type: 'RECOVER_DEFAULT' });
        setSelectChannels([allChannel]);
        setActiveDateItem(`${langFormat(langType, 'anytime')}`);

        setSearchDesc({
            tpl: 'Channel All activities anytime',
            args: [],
            text: `${langFormat(langType, 'Channel All activities anytime')}`
        });
        setSearchDesc({
            tpl: 'Channel All activities anytime',
            args: [],
            text: `${langFormat(langType, 'Channel All activities anytime')}`
        });
    };

    //时间类型或者频道类型发生变化时，更新搜索描述信息
    React.useEffect(() => {
        changeSearchDesc();
    }, [selectChannels, activeDateItem]);

    //显示隐藏搜索侧边页面都先隐藏later时间选择范围
    React.useEffect(() => {
        setDateRangeVisible(false);
    }, [showSearch]);


    //系统当前语言变更时，根据所选条件更新搜索描述信息
    React.useEffect(() => {
        setAllChannel({ id: 0, name: langFormat(langType, 'all') || '' });
        setSearchDesc({
            tpl: searchDesc.tpl,
            args: searchDesc.args,
            text: `${langFormat(langType, searchDesc.tpl, searchDesc.args)}`
        });
        setTotalSearchDesc({
            tpl: totalSearchDesc.tpl,
            args: totalSearchDesc.args,
            text: `${langFormat(langType, totalSearchDesc.tpl, totalSearchDesc.args)}`
        });
    }, [langType]);

    //首次渲染后，首页点击重置按钮，处理重置操作
    React.useEffect(() => {
        if (inited) {
            clearSearch();
        }
    }, [searchStatus]);

    //首次渲染后，after搜索时间范围变更 更新搜索描述信息
    React.useEffect(() => {
        if (inited) {
            changeSearchDesc();
        }
    }, [tempBefore]);

    //首次进入页面，请求频道列表
    React.useEffect(() => {
        async function fetchEvents() {
            try {
                const response = await getChannels();
                setChannels(channels.concat(response.data && response.data.channels));
                setInited(true);
            } catch (error) {
                console.log(error);
            }
        }
        fetchEvents();
    }, []);

    return (

        <div className={`search-searchContainer`}>
            <div className={`test-hide`} >
                {`showSearch:${showSearch};`}
            </div>
            <div className={`search-searchContent`} >
                <div className={`search-dateContainer`} >
                    <div className={`search-title`} >
                        {`${langFormat(langType, 'date')}`}
                    </div>
                    <div className={`search-dates`} >
                        {dateTags.map((dateItem) => {
                            if (dateItem.type !== `later`) {
                                return <div key={dateItem.name} className={`search-dateItem ${dateItem.type === activeDateItem ? 'search-active' : ''}`} onClick={() => { selectTime(dateItem); }}>{dateItem.name}</div>;
                            } else {
                                return (<div key={dateItem.name} className={`search-dateItem ${dateItem.type === activeDateItem ? 'search-active' : ''}`} >
                                    <span onClick={(event) => {
                                        selectTime(dateItem);
                                        setLaterPosition({
                                            x: event.clientX,
                                            y: event.clientY
                                        });
                                    }}>  {dateItem.name}</span>
                                    <Popover visible={dateRangeVisible} laterPosition={laterPosition} ></Popover>
                                </div>);
                            }
                        })}
                    </div>
                </div>
                <div className={`search-channelContainer`} onClick={() => {
                    if (dateRangeVisible) {
                        setDateRangeVisible(false);
                    }
                }}>
                    <div className={`search-title`} style={{ marginTop: dateRangeVisible ? `50px` : 0 }}>
                        {`${langFormat(langType, 'channel')}`}
                    </div>
                    <div className={`search-channels`} >
                        {channels.map((channelItem) => {
                            return <div key={channelItem.id} className={`search-channelItem ${selectChannels.includes(channelItem) ? `search-active` : ''}`} onClick={() => { selectChannel(channelItem); }}>{channelItem.name}</div>;
                        })}
                    </div>
                </div>
            </div>
            <button
                className={`btn btn-lg btn-primary search-bottomButton`}
                onClick={doSearch}
            >
                <div className={`search-icon`}>
                    <i className={`icon-search`}>{`${langFormat(langType, 'search')}`}</i>
                </div>
                <div className={`search-filterDesc`}>
                    {`${searchDesc.text}`}
                </div>
            </button>
        </div >

    );
}
