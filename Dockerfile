FROM mhart/alpine-node:8

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
CMD "yarn start"