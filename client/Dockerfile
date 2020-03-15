FROM node:alpine as builder

RUN apk update && apk add --no-cache make git
RUN mkdir -p /opt/client

WORKDIR /opt/client

# Doubted, explanation in README.md
COPY package.json package-lock.json /opt/client/
RUN npm install @angular/cli@6.0.8 -g && cd /opt/client && npm install 
# npm install will surely be the most sloooooooow operation, doing it here ensures it's not launched unless package.json is modified
COPY . /opt/client

RUN cd /opt/client && npm run build

# From this point on application is available in dist folder, so we'll raise the real container, a simple nginx server
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /opt/client/dist/client/ /etc/nginx/html/

# Environment variable, we'll get it from the docker-compose yaml
ARG APIURL=http://localhost:9292
# Dirty hack to replace the default API URL for the one set up in environment
RUN sed -i 's@http://localhost:9292@'"$APIURL"'@g' /etc/nginx/nginx.conf

EXPOSE 8989
CMD ["nginx", "-g", "daemon off;"]