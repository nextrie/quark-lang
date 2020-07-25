FROM node:12-alpine AS BUILD_IMAGE

WORKDIR /usr/src/app

COPY dist dist
COPY sample sample

FROM node:12-alpine

WORKDIR /usr/src/app

COPY --from=BUILD_IMAGE /usr/src/app/dist ./dist
COPY --from=BUILD_IMAGE /usr/src/app/sample ./sample

EXPOSE 3030

CMD [ "node", "./dist/index.js" ]