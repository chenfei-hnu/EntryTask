### 设计文档

##### 1.store设计
利用useContext，useReducer及action定义，在<App/>标签外出包裹响应的Provider实现状态共享

store模块

auth 用来管理登陆态等用户信息

eventList 用来管理活动列表页相关的搜索，分页等请求参数

eventDetail 用来管理活动详情页的Event基础信息，评论，关注和参与用户等信息

1）auth模块

事件

LOGIN 登陆成功后设置状态为认证成功

LOAD_USER 根据登陆响应token等参数请求用户详细信息并保持

SWITCH_LANG_TYPE 切换系统当前语言

变量

isAuthenticated: boolean; 是否登陆过，已经登陆过需要验证token，没有则直接显示登陆页面即可

user: User | null; 保存当前登陆的用户信息

langType: LangType; 当前系统语言

2）eventList模块

事件

SET_TAB 保存设置页面激活项

SET_INDEX 设置滚动位置对应的列表项序号

FETCH_EVENTS_BEGIN 开始请求活动列表

FETCH_EVENTS_SUCCESS 请求活动列表成功

FETCH_EVENTS_ERROR 请求活动列表失败

RECOVER_DEFAULT 重置请求参数

SET_PAGE  设置活动列表请求的分页参数

SET_SHOWSEARCH  设置列表页面搜索描述显示情况

SET_BEFORE 设置搜索时间before

SET_TEMPBEFORE  设置用户临时选择的搜索时间before

SET_AFTER 设置搜索时间after

SET_TEMPAFTER 设置用户临时选择的搜索时间after

SET_CHANNELS 设置搜索频道

SET_SEARCHDESC 设置列表页面显示的搜索条件描述

SET_SEARCHSTATUS 设置搜索组件显示情况


变量

selectedTab: ITab; 设置页面当前选择的激活项

currentIndex: number;滚动条对应的当前列表项序号

events: Event[]; 请求成功的活动列表  

loading: boolean; 列表是否正在加载

error: string | null; 列表请求失败的错误信息

page: number;列表请求的分页参数

after: number;列表请求的after参数

before: number;列表请求的before参数

channels: string;列表请求的channels参数

tempBefore: number; 搜索组件的临时before参数

tempAfter: number; 搜索组件的临时after参数

searchDesc: string;列表页面的搜索描述

showSearch: boolean;是否显示列表页面的搜索描述

searchStatus: boolean;是否显示搜索组件

2）eventDetail模块

事件

SET_TAB 设置活动详情页的激活项

SET_SHOWCOMMENT 设置是否显示顶部的评论表单区域

UPDATE_EVENT 更新当前活动的部分属性

FETCH_EVENT_BEGIN 开始请求活动详情

FETCH_EVENT_SUCCESS 活动详情请求成功

FETCH_EVENT_ERROR 活动详情请求失败

FETCH_LIKES_BEGIN 开始请求活动关注用户列表

FETCH_LIKES_SUCCESS 活动关注用户列表请求成功

FETCH_LIKES_ERROR 活动关注用户列表请求失败

FETCH_GOING_BEGIN 开始请求活动参与用户列表

FETCH_GOING_SUCCESS 活动参与用户列表请求成功

FETCH_GOING_ERROR 活动参与用户列表请求失败

FETCH_COMMENTS_BEGIN 开始请求活动评论

FETCH_COMMENTS_SUCCESS 活动评论请求成功

FETCH_COMMENTS_ERROR 活动评论请求失败

变量

selectedTab: ITab | null; 活动详情页的激活项

showComment: boolean;是否显示顶部的评论表单区域

event: Event | null; 活动详情

eventLoading: boolean; 活动详情加载状态

eventError: string | null; 活动详情请求失败原因

likedUsers: User[]; 活动关注用户列表

likedUsersLoading: boolean; 活动关注用户列表请求状态

likedUsersError: string | null; 活动关注用户列表请求失败原因

goingUsers: User[]; 活动参与用户列表

goingUsersLoading: boolean; 活动参与用户列表请求状态

goingUsersError: string | null; 活动参与用户列表请求失败原因

comments: Comment[];评论列表

commentsLoading: boolean; 评论请求加载状态

commentsError: string | null; 评论请求失败原因

#####  2.滚动设计

相关组件

EventList 用来请求列表数据，计算分页参数，显示加载状态及空数据状态，显示搜索条件信息

EventPreview 用来显示单个Event的内容

总体思路

```
单个列表项高度固定，页面监听滚动事件，固定每个分页请求20条数据，对请求返回的数据遍历设置index属性，
用来标记处于当前列表的序号，列表项设置为绝对定位，位置通过序号乘以固定高度确定； 
当监听滚动到第10条数据时，自动加载下一个分页的数据，再等到滚动到下一个分页的第10项即总列表第30项时，
再加载后面分页的数据，依次类推，达到延迟加载后续表单项无限列表的效果；
滚动过程中，监听标记当前滚动位置对应的当前列表项序号，EventPreview根据当前列表项序号决定显示清空，
如果序号在当前序号-10，+10的范围内则显示内容，此范围还可以通过计算列表项固定高度及屏幕总高度计算优化；
如果不在此范围内，则不显示内容，使得列表上下滚动的过程中，始终保持显示20条数据内容的效果。
因为列表项时绝对定位，使得列表容易高度始终不影响滚动条高度的计算。
```

1. 使用useEventListener及防抖函数监听列表滚动时间
useEventListener('scroll', throttle(scrollListen, 200));

2. 计算列表项位置相关的常量
```
topOfEventList 首页及设置页面除Event列表外顶部的其他元素总高度
eventItemHeight=236 根据设计图编码后计算出单个Event显示区域的总高度为236px，高度保持固定不变
```

3. 确定请求相关的常量及变量

```
limit=20 每次请求的数据固定为20条　

viewList 所有已经请求到的event数据列表

shouldAddIndex 
用来标记下一个分页数据的请求序号，滚动到此序号便加载缓存数据或请求下一个分页的数据，请求完后进行递增

totalEvent 当前列表的最大数量，达到最大数量后不再请求后面分页的数据
```

4. 定义handleNextView函数

进行数据请求，并对返回的数据进行遍历设置序号，调整请求相关的变量

5. EventPreview根据序号决定当前列表项显示

```
event.index * eventItemHeight + topOfEventList
根据当前序号，列表项固定高度，页面列表顶部内容高度决定当前列表项位置

event.index > (currentIndex + 10) || event.index < (currentIndex - 10）
根据当前滚动位置的列表项序号，决定此项内容是否显示
```

其他编码要点

```
1.将当前滚动位置的列表项放入store，以供列表及列表项组件同步状态变化
2.将列表搜索条件等参数放入store，使得列表及搜索组件同步状态变化
3.利用useEffect return重置store中相关参数，避免首页和设置页切换，请求参数不变的问题
```

##### 优化项

1. 图片资源都使用base64形式内嵌至css

2. 对无限列表监听滚动事件使用防抖函数进行限制，避免频繁调用，使用请求预加载在滚动到末尾之前就将数据请求好

3. 使用PrivateRoute避免用户手动输入URL进行异常资源访问

4. 使用img loading = { 'lazy'}

5. 使用字体图片加载svg的图标资源

6. webpack
```
在webpack，tsconfig及jest的配置文件中，配置常用引用的Alias别名简化代码并提高编译速度

配置optimization splitChunks提取被重复引入的文件，单独生成一个或多个文件

使用HappyPack对 babel和css进行多线程编译，加快编译速度

使用MiniCssExtractPlugin提取单独打包css

使用webpack - dev - server提供开发服务器并在代码更新后进行重载
```

##### 测试覆盖点

1. 通用纯函数测试由不同参数出现的各类选择分支返回情况

2. 组件测试根据初始化store及基础父组件参数渲染情况是否正常，测试根据不同参数值是否显示不同内容，组件中各类点击事件处理函数是否正常触发并执行完成

##### 编码过程中的问题及解决措施

1. 之前都是直接用create-react-app脚手架开始进行编码，没有自行配置，这次通过看很多github项目及通过搜索完成了，基础的webpack+tslint+tsconfig+babel+jest等联合配置

2. 了解了前端react hook相关的一些测试第三方库，并对项目进行配置，对工具函数的e2e测试及组件的简单单元测试进行测试代码编写

3. 对react hook的实际编码不是很熟悉，通过查看相关api及github例子逐渐完成编码，并在添加注释的过程中对代码进行简单整理

4. 服务端代码部分有误，与提供的接口文档不对应的地方自己去查找对应的代码并进行修改，还了解了SQLite客户端展示工具的使用，直观的查看数据库数据

```
对任务给出的服务端路由代码修改
// User
fastify.get('/user', userController.getUserInfo)
fastify.get('/user/events', userController.getUserEvents)
// User
fastify.get('/user/:uid', userController.getUserInfo)
fastify.get('/user/:uid/events', userController.getUserEvents)
```

5. 没有了解过react中国际化相关的库及使用，自行参照之前项目的相关编码进行国际化语言切换的实现

##### 可以改进的地方

1. 很多react hook的实际项目编码规范还是很差，后面了解负责的项目后多熟悉之前老员工的编码规范

2. 测试用例的api及测点离满足项目实际需求还有很大差距，也需要尽快熟悉

3. 项目的目录结果还不是很合理

4. 为尽快完成任务很多异常错误处理都有很多缺失

5. 无限列表的实现目前也只是我自己为满足需求进行思考实现的，方案没有与业内成熟的框架的实现进行对比优化

##### 结尾

通过此次任务编码，熟悉了项目的从0配置，公司所使用的相关框架，以及前端测试等方面的知识，目前还是有很多不足和不熟悉的地方，希望之后多了解相关的业务代码及文档尽快融入工作。