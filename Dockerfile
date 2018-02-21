FROM node:8-alpine

RUN apk update && \
    apk upgrade && \
    apk add --update ca-certificates && \
    apk add chromium --update-cache --repository http://nl.alpinelinux.org/alpine/edge/community \
    rm -rf /var/cache/apk/*
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# RUN npm install -g yarn
RUN yarn
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY src/ ./src

EXPOSE 9000
CMD "nodemon --watch ./src -e js src/index.js"