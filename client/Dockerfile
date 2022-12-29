# Install dependencies only when needed
FROM node:19-alpine AS dependencies
WORKDIR /client
COPY package.json ./
RUN npm install

# Rebuild the source code only when needed
FROM node:19-alpine AS builder
WORKDIR /client
COPY --from=dependencies /client/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM node:19-alpine AS runner

WORKDIR /client
ENV NODE_ENV production
ENV PORT 3000

RUN addgroup --system --gid 1001 chatgroup
RUN adduser --system --uid 1001 chatuser

COPY --from=builder /client/public ./public
COPY --from=builder /client/package.json ./package.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=chatuser:chatgroup /client/.next/standalone ./
COPY --from=builder --chown=chatuser:chatgroup /client/.next/static ./.next/static

USER chatuser
EXPOSE $PORT

CMD ["node", "server.js"]