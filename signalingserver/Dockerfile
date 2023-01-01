# Install dependencies only when needed
FROM node:19-alpine AS dependencies
WORKDIR /signalingserver
COPY package.json ./
RUN npm install

# Rebuild the source code only when needed
FROM node:19-alpine AS runner
WORKDIR /signalingserver
ENV NODE_ENV development
ENV PORT 9000
COPY --from=dependencies /signalingserver/node_modules ./node_modules
COPY . .
EXPOSE $PORT
CMD ["node", "src/index.js"]