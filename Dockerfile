FROM node:12-alpine AS BUILD_IMAGE

WORKDIR /usr/src/app

COPY src src
COPY webpack.config.js webpack.config.js
COPY package.json package.json
COPY tsconfig.json tsconfig.json

RUN npm i typescript ts-loader webpack webpack-cli @types/chai @types/mocha @types/expect @types/node --save
RUN npm run bundle

RUN rm -rf ./node_modules/
RUN rm -rf ./src/
RUN rm -rf package.json
RUN rm -rf tsconfig.json

FROM node:12-alpine

WORKDIR /usr/src/app

COPY --from=BUILD_IMAGE /usr/src/app/dist ./dist

EXPOSE 3030

CMD [ "node", "./dist/bundle.js" ]