# mi-run-node-express-vue

#### 介绍

> 通过华米运动的 API 提交运动步数 <br/>
> 可实现同步运动步数至热门平台，如微信、支付宝等

#### 软件架构
前台：Vue+Element
后台：node.js(express框架)

## 配置参数

| 环境变量                 | 说明                | 值                  |
| ------------------------ | ------------------- | ------------------- |
| username  | 用户名              | 159000000           |
| password  | 密码                | xxxxxx              |
| user_id   | 用户 ID (可选)      | 123456              |
| app_token | APP Token (可选)    | xxxxxxxx            |
| step_size          | 运动步数范围 (必选) |   0-99999|

- 需使用Vue Cli运行/构建当前项目
- 推荐使用 Node.js 12 及以上的运行/构建后台
- 可选账号/密码、UserID/AppToken 两种方式运行

#### 安装教程
前台
```
git clone https://gitee.com/zhang-wenhaoyue/mi-run-node-express-vue.git
cd mi-run
npm install
npm run serve
```
后台
```
cd mi-run-api
npm install
node index (npx nodemon)
```

#### 参与贡献
基于Github 项目二次开发：[sport-editor](https://github.com/Devifish/sport-editor "sport-editor")


