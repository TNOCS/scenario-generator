FROM node:14-slim as builder
##### Install DS-VIZ dependencies #####
RUN mkdir -p /packages/client
RUN mkdir -p /packages/server
RUN mkdir -p /packages/shared
COPY ./packages/client/package.json /packages/client/package.json
COPY ./packages/server/package.json /packages/server/package.json
COPY ./packages/shared/package.json /packages/shared/package.json
COPY ./package.json /package.json
COPY ./lerna.json /lerna.json
WORKDIR /
RUN yarn install

##### Build latest DS-VIZ version #####
COPY . ./
ARG CI_COMMIT_SHORT_SHA_ARG=UNKNOWN_SHA
ENV CI_COMMIT_SHORT_SHA=$CI_COMMIT_SHORT_SHA_ARG
RUN yarn run build

FROM node:14-alpine as worker
RUN mkdir -p /packages/shared/dist
RUN mkdir -p /packages/server/dist
RUN mkdir -p /packages/server/src
COPY --from=builder /packages/shared/dist /packages/shared/dist
COPY --from=builder /packages/shared/package.json /packages/shared/package.json
COPY --from=builder /packages/server/dist /packages/server/dist
COPY --from=builder /packages/server/package.json /packages/server/package.json
COPY --from=builder /packages/client/dist /packages/server/dashboard
COPY --from=builder /package.json /package.json
COPY --from=builder /lerna.json /lerna.json
RUN find /packages/server/dist -name "*.map" -type f -delete
WORKDIR /
RUN yarn install --production
WORKDIR /packages/server
EXPOSE 3005
CMD ["npm", "start"]
