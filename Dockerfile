# Stage 1
FROM node:10-alpine as build-step
RUN mkdir -p /app
WORKDIR /app
COPY package.json /app
COPY nginx.tictactoe.conf /app
RUN npm install
COPY . /app
RUN npm run build -- --configuration="production"

#Stage 2
FROM nginx:1.17.1-alpine
COPY --from=build-step /app/dist/tictactoe-ui /usr/share/nginx/html
COPY --from=build-step /app/nginx.tictactoe.conf /etc/nginx/conf.d/default.conf