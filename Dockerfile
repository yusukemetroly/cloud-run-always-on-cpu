FROM node:16-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY ./ ./

RUN npm run build


FROM node:16-alpine
ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY ./ ./
COPY --from=builder /app/dist /app/dist

CMD ["npm", "run", "start"];
