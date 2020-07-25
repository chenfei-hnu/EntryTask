import React from 'react';
import { ObjStringMap, LangType } from '@Types';
import { i18n } from '@Lang';

//获取本地存储的数据
export function getLocalStorageValue(key: string) {
    const value = localStorage.getItem(key);
    if (!value) return null;
    try {
        return JSON.parse(value);
    } catch (error) {
        return null;
    }
}
//设置本地存储的数据
export function setLocalStorage(key: string, value: string) {
    localStorage.setItem(key, JSON.stringify(value));
}

// 绑定事件监听的处理hook函数
export function useEventListener(
    eventName: string,
    handler: (event: any) => void,
    element = window
) {
    // 创建一个 ref 来存储处理程序
    const saveHandler = { current: (event: any) => {} };

    // 如果 handler 变化了，就更新 ref.current 的值。
    // 这个让我们下面的 effect 永远获取到最新的 handler
    React.useEffect(() => {
        saveHandler.current = handler;
    }, [handler]);

    React.useEffect(
        () => {
            // 确保元素支持 addEventListener
            const isSupported = element && element.addEventListener;
            if (!isSupported) return;

            // 创建事件监听调用存储在 ref 的处理方法
            const eventListener = (event: any) => saveHandler.current(event);

            // 添加事件监听
            element.addEventListener(eventName, eventListener);

            // 清除的时候移除事件监听
            return () => {
                element.removeEventListener(eventName, eventListener);
            };
        },
        [eventName, element] // 如果 eventName 或 element 变化，就再次运行
    );
}
//将日期格式化为指定形式的字符串
export function dateFormat(fmt: string, date: Date) {
    let ret;
    const opt: ObjStringMap = {
        'Y+': date.getFullYear().toString(), // 年
        'm+': (date.getMonth() + 1).toString(), // 月
        'd+': date.getDate().toString(), // 日
        'H+': date.getHours().toString(), // 时
        'M+': date.getMinutes().toString(), // 分
        'S+': date.getSeconds().toString(), // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (const k in opt) {
        if (opt[k]) {
            ret = new RegExp('(' + k + ')').exec(fmt);
            if (ret) {
                fmt = fmt.replace(
                    ret[1],
                    ret[1].length === 1
                        ? opt[k]
                        : opt[k].padStart(ret[1].length, '0')
                );
            }
        }
    }
    return fmt;
}
//获取 英文形式的day month year形式的日期字符串（04 May 2020）或者day month year HH:MM（04 May 2020 13:42）
export function sliceDate(date: string, pre?: boolean) {
    const curDate = new Date(date);
    const [weekday, month, day, year] = curDate.toDateString().split(' ');
    if (pre) {
        return `${day} ${month} ${year}`;
    } else {
        return `${day} ${month} ${year} ${dateFormat('HH:MM', curDate)}`;
    }
}
// 获取今日附近指定间隔指定天数的日期
export function getDate(days: number) {
    const date = new Date(new Date(new Date().toLocaleDateString()).getTime()); //当天0点数据

    date.setDate(date.getDate() + days);

    return date.getTime();
}
//防抖函数
export function debounced(callback: Function, time: number) {
    let lastTime: number;
    return (args: any[]) => {
        if (!lastTime || new Date().getTime() - lastTime > time) {
            lastTime = new Date().getTime();
            callback(args);
        }
    };
}
//获取指定事件与当前事件的间隔，如刚刚，一天前等
export function getTimeDistance(dateTime: Date, langType: LangType) {
    const dateNow = new Date();
    const distance = dateNow.getTime() - dateTime.getTime();

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    if (days === 1) {
        return langFormat(langType, 'yestoday');
    } else if (days > 1) {
        return langFormat(langType, '{0} days ago', [days]);
    }
    const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    if (hours > 0) {
        return langFormat(langType, '{0} hours ago', [hours]);
    }

    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    if (minutes > 0) {
        return langFormat(langType, '{0} minutes ago', [minutes]);
    }
    return langFormat(langType, 'justnow');
}

//根据系统当前语言返回对应的字符串
export function langFormat(langType: LangType, key: string, args?: any[]) {
    let mapedStr;
    if (i18n[langType] && i18n[langType][key]) {
        mapedStr = i18n[langType][key];
    }
    if ((args && args.length === 0) || !mapedStr) return mapedStr;
    if (args) {
        for (let i = 0; i < args.length; i++) {
            mapedStr = mapedStr.replace(
                new RegExp('\\{' + i + '\\}', 'g'),
                args[i]
            );
        }
    }
    return mapedStr;
}
