import API, { TOKEN_KEY, USER_KEY } from './APIUtils';
import { User } from '@Types';
import { setLocalStorage } from '@Utils';
import { setToken } from './APIUtils';

type TUser = {
    user: User & { token: string };
};

//获取当前用户详细信息
export function getCurrentUser(userId: number) {
    return API.get<User>(`/user/${userId}`);
}

//登陆接口
export function login(username: string, password: string) {
    return API.post('/auth/token', {
        username,
        password,
    }).then((user) => {
        if (user.data && user.data.user) {
            user.data.user.token = user.data.token;
        }
        return handleUserResponse(user.data);
    });
}

//处理登陆响应数据
function handleUserResponse({ user: { token, ...user } }: TUser) {
    setLocalStorage(TOKEN_KEY, token);
    setLocalStorage(USER_KEY, JSON.stringify(user));
    setToken(token);
    return user;
}
