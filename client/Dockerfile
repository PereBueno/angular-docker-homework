FROM node:alpine as builder

# Environment variable, we'll get it from the docker-compose yaml
ENV API_URL=http://localhost:9000

RUN apk update && apk add --no-cache make git
RUN mkdir -p /opt/client

WORKDIR /opt/client

# Doubted, explanation in README.md
COPY package.json package-lock.json /opt/client/
RUN npm install @angular/cli@6.0.8 -g && cd /app && npm install 
# npm install will surely be the most sloooooooow operation, doing it here ensures it's not launched unless package.json is modified
COPY . /opt/client

# Dirty hack to replace the default API URL for the one set up in environment
RUN sed -i "s/http:\/\/localhost:9000/$TEST/g" /opt/client/src/environments/environment.ts
RUN cd /app && npm run build

# From this point on application is available in dist folder, so we'll raise the real container, a simple nginx server
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /opt/client/dist /usr/share/nginx/html
EXPOSE 8989
CMD ["nginx", "-g", "daemon off;"]