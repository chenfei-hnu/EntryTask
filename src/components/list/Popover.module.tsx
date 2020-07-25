import React from 'react';
import 'antd-mobile/lib/popover/style/css';
import 'antd-mobile/lib/date-picker/style/css';
import 'antd-mobile/lib/list/style/css';
import { DatePicker, List } from 'antd-mobile';
import { dateFormat } from '@Utils';
import { Postition } from '@Types';
import useEvents from '@context/events';
import './Popover.module.less';

type PopoverProps = {
    visible: boolean;
    laterPosition: Postition;
};
export default function Popover({ visible, laterPosition }: PopoverProps) {
    //未点击搜索前，选择的临时时间范围
    const {
        state: { tempBefore, tempAfter },
        dispatch,
    } = useEvents();

    //after项修改搜索截止时间
    const changeTempBefore = (date) => {
        dispatch({ type: 'SET_TEMPBEFORE', tempBefore: date.getTime() });
    };
    return visible ? (
        <div
            style={{
                position: 'absolute',
                top: '0px',
                left: '0px',
                width: '100%',
            }}
        >
            <div
                className="am-popover-arrow"
                style={{
                    left: `${laterPosition.x || 134}px`,
                    top: `${laterPosition.y + 22 || 144}px`,
                }}
            ></div>
            <div
                className="am-popover fortest"
                style={{ left: '5px', top: `${laterPosition.y + 25 || 147}px` }}
            >
                <div className="am-popover-content">
                    <div className="am-popover-inner">
                        <div className="am-popover-inner-wrapper">
                            <div className="am-popover-item">
                                <div className="am-popover-item-container">
                                    <span className="am-popover-item-content">
                                        <div
                                            className={`popover-timeRangeContainer`}
                                        >
                                            <div className={`popover-itemIcon`}>
                                                <i
                                                    className={`icon-date-from`}
                                                ></i>
                                            </div>
                                            <div
                                                className={`popover-timePickerContainer`}
                                            >
                                                <DatePicker
                                                    mode="date"
                                                    extra=""
                                                    format="YYYY-MM-DD"
                                                    value={new Date(tempAfter)}
                                                    disabled={true}
                                                >
                                                    <List.Item
                                                        arrow="horizontal"
                                                        extra=""
                                                    >
                                                        {dateFormat(
                                                            'dd/mm/YY',
                                                            new Date(tempAfter)
                                                        )}
                                                    </List.Item>
                                                </DatePicker>
                                            </div>
                                            <div
                                                className={`popover-splitChar`}
                                            >
                                                -
                                            </div>
                                            <div className={`popover-itemIcon`}>
                                                <i
                                                    className={`icon-date-to`}
                                                ></i>
                                            </div>
                                            <div
                                                className={`activeTime popover-timePickerContainer`}
                                            >
                                                <DatePicker
                                                    mode="date"
                                                    extra=""
                                                    format="YYYY-MM-DD"
                                                    value={new Date(tempBefore)}
                                                    onChange={changeTempBefore}
                                                >
                                                    <List.Item arrow="horizontal">
                                                        {dateFormat(
                                                            'dd/mm/YY',
                                                            new Date(tempBefore)
                                                        )}
                                                    </List.Item>
                                                </DatePicker>
                                            </div>
                                        </div>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : null;
}
