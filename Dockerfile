FROM node:lts-alpine AS frontend

WORKDIR /app

ADD package.json /app/package.json
ADD yarn.lock /app/yarn.lock

RUN yarn install

ADD . /app

RUN yarn run build

FROM node:lts-alpine

WORKDIR /app

ADD backend/package.json /app/package.json
ADD backend/yarn.lock /app/yarn.lock

RUN yarn install

ADD /backend /app

COPY --from=frontend /app/build /app/public

CMD ["yarn", "run", "start"]
