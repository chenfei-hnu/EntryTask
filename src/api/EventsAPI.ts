import API from './APIUtils';
import { Event } from '@Types';


type Events = {
  events: Event[];
};

//根据分页参数拼接get所需的分页参数字符串
function limit(count: number, p: number) {
  return `limit=${count}&offset=${p ? p * count : 0}`;
}
//获取当前分页的活动列表信息
export function getEvents(page: number, after: number, before: number, channels: string) {
  return API.get<Events>(`/events?after=${after}&before=${before}&${limit(20, page)}&channels=${channels}`);
}
//获取被当前用户关注的活动列表
export function getEventsByLike(uid: number, page: number) {
  return API.get<Events>(
    `/user/${uid}/events?type=liked&${limit(20, page)}`,
  );
}
//获取当前用户参与的活动列表
export function getEventsByGoing(uid: number, page: number) {
  return API.get<Events>(
    `/user/${uid}/events?type=going&${limit(20, page)}`,
  );
}
//获取当前用户浏览过的活动列表
export function getEventsByPast(uid: number, page: number) {
  return API.get<Events>(
    `/user/${uid}/events?type=past&${limit(20, page)}`,
  );
}