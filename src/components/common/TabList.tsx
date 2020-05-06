import React from 'react';
import './TabList.module.less';
import useEvents from '@context/events';
import { ITab } from '@reducers/eventList';
import useEventDetail from '@context/eventDetail';
import { langFormat } from '@Utils';
import useAuth from '@context/auth';

type TabsListProps = {
  data: ITab[];
  isDetail?: boolean;
};

export default function TabList({ data, isDetail }: TabsListProps) {

  //活动详情页面，组件之间共享的当前激活项变量，便于状态更新后刷新视图
  const {
    state: { selectedTab: detailSelectedTab },
    dispatch: detailDispatch,
  } = useEventDetail();

  //设置页面，组件之间共享的当前激活项变量，便于状态更新后刷新视图
  const {
    state: { selectedTab },
    dispatch,
  } = useEvents();

  //当前系统语言参数
  const {
    state: { langType },
  } = useAuth();

  let tabs;
  if (isDetail) {//活动详情页面tabs初始化
    tabs = data.map((tab) => (
      <DetailTab
        key={tab.type}
        isSelected={detailSelectedTab && detailSelectedTab.type === tab.type || false}
        onClick={() => {
          detailDispatch({ type: 'SET_TAB', tab });
          const element = document.getElementById(tab.type);
          window.scrollTo({
            behavior: "smooth",
            top: element ? element.offsetTop : 0
          });
        }}
        text={`${langFormat(langType, tab.type)}`}
        flex={tab.flex}
        icon={detailSelectedTab && detailSelectedTab.type === tab.type ? `icon-${tab.icon}` : `icon-${tab.icon}-outline`}
      />
    ));
  } else {//设置页面tabs初始化
    tabs = data.map((tab) => (
      <Tab
        key={tab.type}
        isSelected={selectedTab && selectedTab.type === tab.type || false}
        onClick={() => dispatch({ type: 'SET_TAB', tab })}
        text={`${langFormat(langType, tab.type)}`}
        icon={selectedTab && selectedTab.type === tab.type ? `icon-${tab.icon}` : `icon-${tab.icon}-outline`}
        count={tab.count}
      />
    ));
  }


  return <div className={`tabList-itemContainer`}>
    {tabs}
  </div>;
}

//初始化单个tabs项所需参数的数据格式
type TabProps = {
  isSelected: boolean;
  onClick: () => void;
  text: string;
  icon: string;
  flex?: number;
  count?: number;
};

//活动详情页面单个tabs项的dom渲染
function DetailTab({ isSelected, onClick, text, icon, flex }: TabProps) {
  return (
    <div className={`tabList-middleItem ${isSelected ? `tabList-active` : ''}`} style={{ flex }} onClick={onClick}>
      <i className={icon}>{`${text}`}</i>
    </div>
  );
}

//设置页面单个tabs项的dom渲染
function Tab({ isSelected, onClick, text, icon, count }: TabProps) {
  return (
    <div className={`tabList-middleItem ${isSelected ? `tabList-active` : ''}`} onClick={onClick}>
      <i className={icon}>{`${count} ${text}`}</i>
    </div>
  );
}