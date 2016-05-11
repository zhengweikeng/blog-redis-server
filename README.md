### blog-redis-server

node.js version >= 6.0.0

开发
```bash
npm run dev
```

部署
```bash
npm i pm2 -g

NODE_ENV=production redis_pass=xxxx  pm2 start server.js --name blog-server
```