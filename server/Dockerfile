FROM node:8.6.0

RUN mkdir /server
WORKDIR /server
COPY package.json /server
RUN npm install
COPY . /server
EXPOSE 3000
CMD ["npm", "start"]
