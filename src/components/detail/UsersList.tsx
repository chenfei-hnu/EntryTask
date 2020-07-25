import React from 'react';
import './UsersList.module.less';
import { User } from '@Types';

//点赞和参与活动的用户列表所需的参数
type UserListProps = {
    icon: string;
    count: number;
    text: string;
    users: User[];
};

export default function UsersList({ icon, count, text, users }: UserListProps) {
    //所有的用户头像列表
    const [allImgs, setAllImgs] = React.useState<string[]>([]);
    //所需显示的用户头像列表
    const [viewImgs, setViewImgs] = React.useState<string[]>([]);

    //点击展开显示所有列表的处理逻辑
    const onShowAll = () => {
        setViewImgs(allImgs);
    };

    //初始化显示最多一行头像，超过最后一个图标显示展开
    React.useEffect(() => {
        const tempAllImgs = [];
        let tempPreImgs = [];
        for (const item of users) {
            tempAllImgs.push(item.avatar);
        }
        if (users.length > 7) {
            const preUsers = users.slice(0, 6);
            for (const item of preUsers) {
                tempPreImgs.push(item.avatar);
            }
            tempPreImgs.push('down');
        } else {
            tempPreImgs = [...tempAllImgs];
        }
        setAllImgs(tempAllImgs);
        setViewImgs(tempPreImgs);
        return () => {};
    }, [users]);
    return (
        <div className={`usersList userList-bg`}>
            <div className={`userList-statusInfo`}>
                <i className={icon}>{`${count} ${text}`}</i>
            </div>
            <div className={`userList-userList`}>
                {viewImgs.map((item, index) =>
                    item === 'down' ? (
                        <i
                            key={item}
                            className={`userList-down`}
                            onClick={onShowAll}
                        ></i>
                    ) : (
                        <img
                            loading={'lazy'}
                            key={`${item}-${index}`}
                            src={item}
                            alt={item}
                        />
                    )
                )}
            </div>
        </div>
    );
}
