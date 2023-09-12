# syntax=docker/dockerfile:1
   
FROM keymetrics/pm2:12-alpine
WORKDIR /app
COPY . .
RUN rm -rf node_modules
RUN  npm install
CMD ["node", "index.js"]
EXPOSE 4000
