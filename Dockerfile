FROM library/node:16.3.0-alpine
RUN apk update && apk upgrade && apk add --no-cache git
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./ /usr/src/app
ARG BUILD_DATABASE_URL
ARG CLOUDINARY_URL
ENV SEQUELIZE_URL=$BUILD_DATABASE_URL
ENV ClOUDINARY_URL=$ClOUDINARY_URL
ENV NODE_ENV production
RUN npm ci --omit=dev && npm cache clean --force
ENV PORT 80
EXPOSE 80
CMD [ "npm", "start" ]
