import API from './APIUtils';
//根据分页参数拼接get所需的分页参数字符串
function limit(count: number, p: number) {
  return `limit=${count}&offset=${p ? p * count : 0}`;
}
//获取活动详细信息
export function getEventDetail(eventId: number) {
  return API.get(`/events/${eventId}`);
}
//获取关注当前活动的用户列表
export function getEventLikes(eventId: number) {
  return API.get(`/events/${eventId}/likes?${limit(20, 0)}`);
}
//获取参与当前活动的用户列表
export function getEventGoings(eventId: number) {
  return API.get(`/events/${eventId}/participants?${limit(20, 0)}`);
}
//获取当前活动的评论列表
export function getEventComments(eventId: number) {
  return API.get(`/events/${eventId}/comments?${limit(20, 0)}`);
}
//关注当前活动
export function likeEvent(eventId: number) {
  return API.post(`/events/${eventId}/likes`);
}
//参与当前活动
export function joinEvent(eventId: number) {
  return API.post(`/events/${eventId}/participants`);
}
//评论当前活动
export function commentEvent(eventId: number, comment: string) {
  return API.post(`/events/${eventId}/comments`, {
    comment
  });
}