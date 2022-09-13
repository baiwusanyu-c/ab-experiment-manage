<h1 align="center">AB实验后台管理</h1>

// TODO 实验版本删除
// TODO 日志更新
// TODO 添加发版

## 前端运行指令

```bash
# 克隆项目
git clone https://XXXX.XXXX.XXXX.XXXX


# 项目根目录安装依赖
pnpm i 或运行 pnpm run init

# 以开发后台地址启动前端开发服务
pnpm run serve:dev

# 以测试后台地址启动前端开发服务
pnpm run serve:stage

# 以生产后台地址启动前端开发服务
pnpm run serve:prod

# 以开发后台地址构建打包
pnpm run build:dev

# 以测试后台地址构建打包
pnpm run build:stage

# 以生产后台地址构建打包
pnpm run build:prod

# eslint语法校验与部分自动修复
pnpm run lint:fix

# husky文件生成（已经配置好了，一般不需要运行）
pnpm run prepare

# 预览构建项目服务（直接运行打包产物，本地预览）
pnpm run preview

# 压缩图片（新增图片时，拖拽到对应文件夹运行一次即可）
pnpm run optimizeImages
```
