FROM library/node:16.4.1
RUN apk update && apk upgrade && apk add --no-cache git
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./ /usr/src/app
ARG BUILD_DATABASE_URL
ENV SEQUELIZE_URL=$BUILD_DATABASE_URL
ENV NODE_ENV production
RUN npm install --production && npm cache clean --force && npm run build --if-present
ENV PORT 80
EXPOSE 80
CMD [ "npm", "start" ]
