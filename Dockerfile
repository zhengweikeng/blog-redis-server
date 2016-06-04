FROM daocloud.io/library/node:6.2.0

MAINTAINER zhengweikeng

ADD ./ /blog-redis-server

WORKDIR /blog-redis-server

RUN npm install

CMD npm run start
