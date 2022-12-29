# from https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
FROM node:19-alpine AS dependencies
WORKDIR /client
COPY package.json ./
RUN npm install

FROM node:19-alpine AS builder
ARG SIGNALING_SERVER_HOSTNAME=localhost
ARG SIGNALING_SERVER_PORT=9000
ARG SIGNALING_SERVER_ENDPOINT=/chat
WORKDIR /client
COPY --from=dependencies /client/node_modules ./node_modules
COPY . .
RUN echo NEXT_PUBLIC_SIGNALING_SERVER_HOSTNAME=$SIGNALING_SERVER_HOSTNAME >> .env.production
RUN echo NEXT_PUBLIC_SIGNALING_SERVER_PORT=$SIGNALING_SERVER_PORT >> .env.production
RUN echo NEXT_PUBLIC_SIGNALING_SERVER_ENDPOINT=$SIGNALING_SERVER_ENDPOINT >> .env.production
RUN npm run build

FROM nginx:alpine AS runner
ENV PORT=3000
WORKDIR /client/static
COPY --from=builder /client/out .
# https://hub.docker.com/_/nginx environment variables
COPY nginx.conf.template /etc/nginx/templates/nginx.conf.template