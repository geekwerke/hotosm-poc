FROM node:lts-alpine

WORKDIR /code

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json package-lock.json /code/
RUN npm install --silent

COPY . ./

CMD ["npm", "start"]