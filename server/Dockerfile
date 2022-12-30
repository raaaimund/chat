# Install dependencies only when needed
FROM node:19-alpine AS dependencies
WORKDIR /server
COPY package.json ./
RUN npm install

# Rebuild the source code only when needed
FROM node:19-alpine AS runner
WORKDIR /server
ENV NODE_ENV development
ENV PORT 9000
COPY --from=dependencies /server/node_modules ./node_modules
COPY . .
EXPOSE $PORT
CMD ["node", "src/index.js"]