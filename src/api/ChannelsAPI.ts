import API from './APIUtils';

//获取频道列表
export function getChannels() {
    return API.get('/channels');
}
