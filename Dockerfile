FROM node:12-alpine AS BUILD_IMAGE

WORKDIR /usr/src/app

COPY dist dist
COPY sample sample
COPY tsconfig.json tsconfig.json
COPY src src

RUN npm i ts-node tsconfig-paths typescript

FROM node:12-alpine

WORKDIR /usr/src/app

COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /usr/src/app/tsconfig.json ./tsconfig.json
COPY --from=BUILD_IMAGE /usr/src/app/dist ./dist
COPY --from=BUILD_IMAGE /usr/src/app/src ./src
COPY --from=BUILD_IMAGE /usr/src/app/sample ./sample

EXPOSE 3030

CMD [ "node", "-r", "ts-node/register/transpile-only", "-r", "tsconfig-paths/register", "dist/index.js" ]