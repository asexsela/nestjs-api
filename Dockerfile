FROM node:16-alpine

WORKDIR /var/www/api

ADD package.json package.json
RUN yarn

ADD . .
RUN yarn build

CMD ["node", "./dist/main.js"]
