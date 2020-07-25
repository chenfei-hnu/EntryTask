import { User, LangType } from '@Types';

export type AuthAction =
    | {
          type: 'LOGIN';
      }
    | {
          type: 'LOAD_USER';
          user: User;
      }
    | {
          type: 'SWITCH_LANG_TYPE';
          langType: LangType;
      };

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    langType: LangType;
}

export const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    langType: 'en',
};

export function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'LOGIN': {
            //登陆成功后设置状态为认证成功
            return { ...state, isAuthenticated: true };
        }
        case 'SWITCH_LANG_TYPE': {
            //切换系统当前语言
            return { ...state, langType: action.langType };
        }
        case 'LOAD_USER': {
            //根据登陆响应token等参数请求用户详细信息并保持
            return { ...state, user: action.user };
        }
        default:
            return state;
    }
}
