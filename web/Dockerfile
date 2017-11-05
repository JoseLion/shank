FROM node:8.6.0

RUN mkdir /web
WORKDIR /web
COPY package.json /server
RUN npm install
COPY . /web
EXPOSE 8000
CMD ["npm", "run", "dev"]
