import React from 'react';
import './Header.module.less';
import { Link } from '@reach/router';
import useAuth from '@context/auth';
import useEvents from '@context/events';


export default function Header() {
  const {
    state: { user, langType },
    dispatch: authDispatch,
  } = useAuth();
  const {
    state: { showSearch },
    dispatch,
  } = useEvents();
  const isListPage = window.location.pathname === '/';
  const changeSearch = () => {
    dispatch({ type: 'SET_SHOWSEARCH', showSearch: !showSearch });
  };
  const switchLang = () => [
    authDispatch({ type: 'SWITCH_LANG_TYPE', langType: langType === 'zh' ? 'en' : 'zh' })
  ];
  return (
    <div className={`header-topContainer`}>
      <div className={`test-hide`} >
        {`showSearch:${showSearch};`}
      </div>
      {isListPage ? <div
        className={`header-topBtn header-searchBtn`}
        onClick={changeSearch}
      >
        <i className={`icon-search`}></i>
      </div> :
        <Link
          to="/"
          className={`header-topBtn header-homeBtn`}
        >
          <i className={`icon-home`}></i>
        </Link>
      }
      <div
        className={`header-topBtn  header-logoBtn`}
      >
        <i className={`icon-logo-cat`}></i>
      </div>
      <div
        onClick={switchLang}
        className={`header-topBtn  header-langBtn`}
      >
        <i className={`icon-${langType === 'en' ? 'zhType' : 'enType'}`}></i>
      </div>
      <Link
        to="/setting"
        className={`header-topBtn header-avatarBtn`}
      >
        <img
          loading={'lazy'}
          src={user && user.avatar || ''}
          className={`header-userImg`}
          alt={user && user.username || ''}
        />
      </Link>
    </div>
  );
}
