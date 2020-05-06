import React from 'react';
import './CommentsList.module.less';
import { Comment } from '@Types';
import { getTimeDistance } from '@Utils';
import useEventDetail from '@context/eventDetail';
import useAuth from '@context/auth';
type CommentsListProps = {
  comments: Comment[]
};

export default function CommentsList({ comments }: CommentsListProps) {
  //系统当前语言
  const {
    state: { langType },
  } = useAuth();
  //活动详情redux处理器
  const {
    state: { showComment },
    dispatch,
  } = useEventDetail();

  //当前显示的评论列表
  const [viewComments, setViewComments] = React.useState<Comment[]>([]);

  //显示评论输入区域
  const showCommentArea = () => {
    dispatch({ type: 'SET_SHOWCOMMENT', showComment: true });
    const element = document.getElementById('operate');
    window.scrollTo({
      behavior: "smooth",
      top: element ? element.offsetTop : 0
    });
  };
  //评论数据刷新更新视图
  React.useEffect(() => {
    setViewComments(comments);
  }, [comments]);
  return (
    <div className={`commentssList commonsList-bg`} >
      <div className={`test-hide`} >
        {`showComment:${showComment};`}
      </div>
      {
        viewComments.map((item) => (
          <div
            key={item.id}
            className={`commonsList-commentItem`}
          >
            <div className={`commonsList-left`}>
              <img
                loading={'lazy'}
                src={item.user.avatar}
                alt={item.user.username}
              />
            </div>
            <div className={`commonsList-center`}>
              <div className={`commonsList-publishInfo`}>
                <div className={`commonsList-username`}>
                  {item && item.user.username}
                </div>
                <div className={`commonsList-publishTime`}>
                  {item && getTimeDistance(new Date(item.create_time), langType)}
                </div>
              </div>
              <div className={`commonsList-comment`}>
                {item && item.comment}
              </div>
            </div>
            <div className={`commonsList-right`} onClick={showCommentArea}>

              <i className={`icon-reply`} ></i>
            </div>
          </div>
        ))
      }
    </div >
  );
}
