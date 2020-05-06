import React from 'react';
import EventList from '@common/EventList';
import useEvents from '@context/events';
import { Drawer } from 'antd-mobile';
import 'antd-mobile/lib/drawer/style/css';
import Search from './Search.module';
import './List.module.less';

export default function List() {

  //是否显示搜索侧边页面及分页参数
  const {
    state: { showSearch, page },
    dispatch,
  } = useEvents();

  //点击搜索侧边页面右侧的空白区域，隐藏搜索侧边页面的处理逻辑
  const hanldeEmptyClick = () => {
    dispatch({ type: 'SET_SHOWSEARCH', showSearch: false });
  };

  //为了规避设置页面和首页切换过程，请求参数来不及初始化而使用错误的请求参数问题，当判断请求参数已经初始化后，再加载无限列表请求数据
  const [paramInitd, setParamInitd] = React.useState<boolean>(false);
  React.useEffect(() => {
    if (page === 0) {
      setParamInitd(true);
    }
  }, [page]);

  return (
    <div className={`list-eventList`}>
      {
        <div className={!showSearch ? `list-hide` : ''}>
          <Drawer
            style={{ minHeight: document.documentElement.clientHeight }}
            sidebar={<Search></Search>}
            transitions={true}
            docked={showSearch}
          ><div></div>
          </Drawer>
          <div className={`list-rightEmpty`} onClick={hanldeEmptyClick}></div>
        </div>
      }
      {paramInitd ? <EventList /> : null}
    </div >
  );
}
