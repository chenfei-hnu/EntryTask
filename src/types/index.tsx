


export interface User {
  email: string;
  username: string;
  id: number;
  avatar: string;
  likes_count: number;
  goings_count: number;
  past_count: number;
}
export interface Event {
  id: number;
  name: string;
  channel: Channel;
  begin_time: string;
  end_time: string;
  create_time: string;
  update_time: string;
  location: string;
  location_detail: string;
  description: string;
  index: number;
  creator: User;
  likes_count: number;
  goings_count: number;
  images: string[];
  me_likes: boolean;
  me_going: boolean;
}
export interface Channel {
  id: number;
  name: string;
}
export interface TDate {
  type: string;
  name: string;
  after: number;
  before: number;
}
export interface Comment {
  id: number;
  create_time: Date;
  comment: string;
  event: Event;
  user: User;
}
export type SearchDesc = {
  tpl: string,
  args: any[],
  text: string
};
export type Postition = {
  'x': number,
  'y': number
};
export type LangType = 'zh' | 'en';
export interface ObjBooleanMap {
  [propName: string]: boolean;
}
export interface ObjStringMap {
  [propName: string]: string;
}
export interface ObjArrMap {
  [propName: string]: any[];
}
export interface ObjAnyMap {
  [propName: string]: any;
}
export interface ObjObjMap {
  [propName: string]: ObjStringMap;
}
export interface Errors {
  [key: string]: string[];
}
