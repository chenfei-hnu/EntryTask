import React from 'react';
import { login, getCurrentUser } from '@api/AuthAPI';
import ListErrors from '@common/ListErrors';
import useAuth from '@context/auth';
import { navigate, Link, RouteComponentProps, Redirect } from '@reach/router';
import { Errors, User } from '@Types';
import { langFormat } from '@Utils';
import './Login.module.less';

export default function Login(_: RouteComponentProps) {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const {
        state: { user, isAuthenticated, langType },
        dispatch,
    } = useAuth();
    //页面初始是否是否显示token已失效
    const initError =
        !user && isAuthenticated ? langFormat(langType, 'invalid token') : null;

    //登陆请求的错误信息
    const [errors, setErrors] = React.useState<Errors | null>();

    //登陆处理函数，成功跳转到首页，失败显示错误提示
    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        setLoading(true);
        try {
            const user: User = await login(username, password);
            const payload = await getCurrentUser(user && user.id);
            const responseUser: User = payload.data;
            dispatch({ type: 'LOAD_USER', user: responseUser });
            navigate('/');
        } catch (error) {
            console.log(error);
            setLoading(false);
            if (error.status === 422 || error.status === 404) {
                error.data.error = [error.data.error];
                setErrors(error.data);
            }
        }
    };

    return (
        <div className={`login-bg`}>
            <div className={`test-hide`}>
                {`username:${username};password:${password};loading:${loading};isAuthenticated:${isAuthenticated};langType:${langType};user.id:${
                    user && user.id
                };`}
            </div>
            <div className={`login-loginContent`}>
                <div className={`login-contentBg`}>
                    <div className="col-md-6 offset-md-3 col-xs-12">
                        <div className={`text-xs-center login-title`}>
                            {langFormat(langType, 'slogan')}
                        </div>
                        <div className={`text-xs-center login-subtitle`}>
                            {langFormat(langType, 'appName')}
                        </div>
                        <div className={`login-logo`}>
                            <i className={`icon-logo-cat`}></i>
                        </div>

                        <form className={`login-form`}>
                            <div
                                className={`login-formItem login-marginBottom`}
                            >
                                <input
                                    name="username"
                                    className="form-control form-control-lg username"
                                    type="username"
                                    value={username}
                                    placeholder={langFormat(
                                        langType,
                                        'usernamePlaceholder'
                                    )}
                                    onChange={(event) =>
                                        setUsername(event.target.value)
                                    }
                                />
                                <i className={`icon-user`}></i>
                            </div>
                            <div className={`login-formItem`}>
                                <input
                                    name="password"
                                    className="form-control form-control-lg password"
                                    type="password"
                                    value={password}
                                    placeholder={langFormat(
                                        langType,
                                        'passwordPlaceholder'
                                    )}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                />
                                <i className={`icon-password`}></i>
                            </div>
                            <div className={`login-formItem login-error`}>
                                {errors ||
                                    (initError && (
                                        <ListErrors
                                            errors={errors || initError}
                                        />
                                    ))}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <button
                className={`btn btn-lg btn-primary login-bottomButton`}
                onClick={handleSubmit}
                disabled={loading}
            >
                {langFormat(langType, 'login')}
            </button>
        </div>
    );
}
