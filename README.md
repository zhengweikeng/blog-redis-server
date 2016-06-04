### blog-redis-server

node.js version >= 6.0.0

### 开发
```bash
npm run dev
```

### docker部署
应用部署于daocloud
```bash
docker login daocloud.io

docker build -t daocloud.io/zhengweikeng/blog-redis-server .

# 可以检查一下
docker run -it daocloud.io/zhengweikeng/blog-redis-server /bin/bash

# push 到 daocloud
docker push daocloud.io/zhengweikeng/blog-redis-server
```

redis采用daocloud提供的redis服务