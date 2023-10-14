FROM node:18.18.0 as development

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5000

CMD [ "npm" , "run" , "start" ]

FROM node:18.18.0 as production

WORKDIR /app

COPY package.json .

RUN npm install --only=production

COPY . .

RUN npm run build

EXPOSE 5000

CMD [ "npm" , "run" ,"start:prod" ]
