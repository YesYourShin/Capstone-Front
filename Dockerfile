FROM node:14-alpine 
ENV TZ=Asia/Seoul
WORKDIR /app
COPY package.json .
RUN npm install
COPY . . 
RUN npm run build 
ENV HOST 0.0.0.0
EXPOSE 7000
CMD npm run start