import React from 'react';
import './Detail.module.less';
import useEventDetail from '@context/eventDetail';
import { RouteComponentProps } from '@reach/router';
import {
    getEventDetail,
    getEventLikes,
    getEventGoings,
    getEventComments,
    likeEvent,
    joinEvent,
    commentEvent,
} from '@api/EventDetailAPI';
import TabList from '@common/TabList';
import { ITab } from '@reducers/eventList';
import {
    sliceDate,
    dateFormat,
    langFormat,
    getTimeDistance,
    useEventListener,
} from '@Utils';
import UsersList from '@components/detail/UsersList';
import CommentsList from '@components/detail/CommentsList';
import useAuth from '@context/auth';

export default function Detail({
    eventId = 0,
}: RouteComponentProps<{ eventId: number }>) {
    //活动详情相关的数据及状态信息
    const {
        state: {
            event,
            eventLoading,
            likedUsers,
            likedUsersLoading,
            goingUsers,
            goingUsersLoading,
            comments,
            commentsLoading,
            showComment,
        },
        dispatch,
    } = useEventDetail();
    //系统当前语言
    const {
        state: { langType },
    } = useAuth();
    //详情，参与列表及评论切换的tabs数据
    const tabsData: ITab[] = [
        { type: 'Details', icon: 'info', flex: 1 },
        {
            type: 'Participants',
            icon: 'people',
            flex: langType === 'en' ? 1.3 : 1,
        },
        { type: 'Commens', icon: 'comment', flex: 1 },
    ];
    //当前用户输入的评论信息
    const [curComment, setCurComment] = React.useState<string>('');
    //是否需要将tabs固定在顶部
    const [fixTabs, setFixTabs] = React.useState<boolean>(false);

    const aboutTopHeight = document.documentElement.clientHeight * 0.07 + 120; //顶部菜单及basic内活动名称等项高度
    //监听滚动时间便于决定tabs是否固定顶部显示
    const scrollListen = () => {
        setFixTabs(window.scrollY > aboutTopHeight);
    };
    useEventListener('scroll', scrollListen);

    //显示输入评论区域的处理逻辑
    const showCommentArea = () => {
        dispatch({ type: 'SET_SHOWCOMMENT', showComment: true });
    };

    //发布评论的处理逻辑
    const doComment = async () => {
        await commentEvent(eventId, curComment);
        dispatch({ type: 'SET_SHOWCOMMENT', showComment: false });
        await getComments();
    };

    //关闭输入评论区域的处理逻辑
    const doClose = () => {
        dispatch({ type: 'SET_SHOWCOMMENT', showComment: false });
    };

    //关注当前活动的处理逻辑
    const doLike = () => {
        if (event && !event.me_likes) {
            event.me_likes = true;
            dispatch({ type: 'UPDATE_EVENT', payload: { event } });
            likeEvent(event.id);
        }
    };

    //参与当前活动的处理逻辑
    const doJoin = () => {
        if (event && !event.me_going) {
            event.me_going = true;
            dispatch({ type: 'UPDATE_EVENT', payload: { event } });
            joinEvent(event.id);
        }
    };

    //获取当前活动列表的处理逻辑
    async function getComments() {
        dispatch({ type: 'FETCH_COMMENTS_BEGIN' });
        try {
            const payload = await getEventComments(eventId);
            dispatch({ type: 'FETCH_COMMENTS_SUCCESS', payload: payload.data });
        } catch (error) {
            dispatch({ type: 'FETCH_COMMENTS_ERROR', error });
        }
    }

    //初始化时获取当前活动的相关信息
    React.useEffect(() => {
        async function getDetail() {
            dispatch({ type: 'FETCH_EVENT_BEGIN' });
            try {
                const payload = await getEventDetail(eventId);
                dispatch({
                    type: 'FETCH_EVENT_SUCCESS',
                    payload: payload.data,
                });
            } catch (error) {
                dispatch({ type: 'FETCH_EVENT_ERROR', error });
            }
        }
        async function getLikes() {
            dispatch({ type: 'FETCH_LIKES_BEGIN' });
            try {
                const payload = await getEventLikes(eventId);
                dispatch({
                    type: 'FETCH_LIKES_SUCCESS',
                    payload: payload.data,
                });
            } catch (error) {
                dispatch({ type: 'FETCH_LIKES_ERROR', error });
            }
        }
        async function getGoing() {
            dispatch({ type: 'FETCH_GOING_BEGIN' });
            try {
                const payload = await getEventGoings(eventId);
                dispatch({
                    type: 'FETCH_GOING_SUCCESS',
                    payload: payload.data,
                });
            } catch (error) {
                dispatch({ type: 'FETCH_GOING_ERROR', error });
            }
        }
        if (eventId) {
            getDetail();
            getGoing();
            getLikes();
            getComments();
        }
        return () => {};
    }, [eventId]);

    return (
        <div className={`detail-page detail-bg`}>
            {eventLoading ||
            likedUsersLoading ||
            goingUsersLoading ||
            commentsLoading ? (
                <div className={`detail-loading`}>Loading...</div>
            ) : null}
            <div className={`test-hide`}>{`showComment:${showComment};`}</div>
            <div className={`detail-basic`}>
                <div className={`detail-channelRow`}>
                    <div className={`detail-channelTag`}>
                        {event && event.channel.name}
                    </div>
                </div>
                <div className={`detail-nameRow`}>{event && event.name}</div>
                <div className={`detail-userRow`} id="Details">
                    <div className={`detail-userImg`}>
                        <img
                            loading={'lazy'}
                            src={(event && event.creator.avatar) || ''}
                            alt={(event && event.creator.username) || ''}
                        />
                    </div>
                    <div className={`detail-userDetail`}>
                        <div className={`detail-username`}>
                            {event && event.creator.username}
                        </div>
                        <div className={`detail-pulishTime`}>
                            {event &&
                                langFormat(langType, '{0}publishe', [
                                    getTimeDistance(
                                        new Date(event.create_time),
                                        langType
                                    ),
                                ])}
                        </div>
                    </div>
                </div>
            </div>
            <div
                className={`${fixTabs ? `detail-fixTabs` : ''} ${
                    langType === 'en' ? `detail-tabs` : `detail-tabsZh`
                }`}
            >
                <TabList data={tabsData} isDetail={true}></TabList>
            </div>
            <div className={`detail-detail`}>
                {event && event.images.length ? (
                    <div className={`detail-imgContainer`}>
                        <img
                            loading={'lazy'}
                            src={(event && event.images[0]) || ''}
                            alt={''}
                        />
                    </div>
                ) : null}
                <div className={`detail-desc`}>
                    {event && event.description}
                </div>
                <div className={`detail-when`}>
                    <div className={`detail-title`}>
                        <div className={`detail-titleChar`}></div>
                        {`${langFormat(langType, 'when')}`}
                    </div>
                    <div className={`detail-timeContainer`}>
                        <div className={`detail-timeLeft`}>
                            <div className={`detail-timeRangeContainer`}>
                                <div className={`detail-itemIcon`}>
                                    <i className={`icon-date-from`}></i>
                                    <div className={`detail-timeText`}>
                                        {event &&
                                            sliceDate(event.begin_time, true)}
                                    </div>
                                </div>
                                <div className={`detail-itemDetail`}>
                                    {dateFormat(
                                        'HH:MM',
                                        new Date(
                                            (event && event.begin_time) || 0
                                        )
                                    )}
                                    <span className={`detail-ampm`}>am</span>
                                </div>
                            </div>
                        </div>
                        <div className={`detail-timeRight`}>
                            <div className={`detail-timeRangeContainer`}>
                                <div className={`detail-itemIcon`}>
                                    <i className={`icon-date-to`}></i>
                                    <div className={`detail-timeText`}>
                                        {event &&
                                            sliceDate(event.end_time, true)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`detail-where`} id="Participants">
                    <div className={`detail-title`}>
                        <div className={`detail-titleChar`}></div>
                        {`${langFormat(langType, 'where')}`}
                    </div>
                    <div className={`detail-location`}>
                        {event && event.location}
                    </div>
                    <div className={`detail-locationDetail`}>
                        {event && event.location_detail}
                    </div>
                    <div className={`detail-locationImg`}></div>
                </div>
            </div>
            <div className={`detail-goingLike`} id="Commens">
                <UsersList
                    icon={'icon-check-outline'}
                    text={'going'}
                    count={(event && event.goings_count) || 0}
                    users={goingUsers}
                ></UsersList>
                <div className={`detail-rowLine`}></div>
                <UsersList
                    icon={'icon-like-outline'}
                    text={'likes'}
                    count={(event && event.likes_count) || 0}
                    users={likedUsers}
                ></UsersList>
            </div>
            <div className={`detail-comments`}>
                <CommentsList comments={comments}></CommentsList>
            </div>
            <div className={`detail-operate`} id="operate">
                {showComment ? (
                    <div className={`detail-commentContainer`}>
                        <div className={`detail-form`}>
                            <div className={`detail-close`} onClick={doClose}>
                                <i className={`icon-cross`}></i>
                            </div>
                            <input
                                className="form-control form-control-lg"
                                value={curComment}
                                placeholder={`${langFormat(
                                    langType,
                                    'Leave your comment here'
                                )}`}
                                onChange={(event) =>
                                    setCurComment(event.target.value)
                                }
                            />
                        </div>
                        <div
                            className={`detail-commentButton`}
                            onClick={doComment}
                        >
                            <i className={`icon-send`}></i>
                        </div>
                    </div>
                ) : (
                    <div className={`detail-buttonsContainer`}>
                        <div className={`detail-operateLeft`}>
                            <div
                                className={`detail-operateComment`}
                                onClick={showCommentArea}
                            >
                                <i className={`icon-comment-single`}></i>
                            </div>
                            <div
                                className={`detail-operateLike`}
                                onClick={doLike}
                            >
                                {event && event.me_likes ? (
                                    <i
                                        className={`icon-like detail-active`}
                                    ></i>
                                ) : (
                                    <i className={`icon-like-outline`}></i>
                                )}
                            </div>
                        </div>
                        <div className={`detail-operateRight`}>
                            <button
                                className={`btn btn-lg btn-primary detail-joinButton`}
                                onClick={doJoin}
                            >
                                {event && event.me_going ? (
                                    <div
                                        className={`detail-icon detail-active`}
                                    >
                                        <i
                                            className={`icon-check`}
                                        >{`${langFormat(
                                            langType,
                                            'joined'
                                        )}`}</i>
                                    </div>
                                ) : (
                                    <div className={`detail-icon`}>
                                        <i
                                            className={`icon-check-outline`}
                                        >{`${langFormat(langType, 'join')}`}</i>
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
