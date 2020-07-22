FROM node:12-alpine AS BUILD_IMAGE

RUN apk update && apk add npm curl bash python g++ make && rm -rf /var/cache/apk/*

WORKDIR /usr/src/app

COPY package.json ./
COPY src src

FROM node:12-alpine

WORKDIR /usr/src/app

COPY --from=BUILD_IMAGE /usr/src/app/src ./src

RUN npm install --global npm typescript ts-node
RUN npm install --save-dev @types/node

EXPOSE 3030

CMD [ "ts-node", "./src/index.ts" ]