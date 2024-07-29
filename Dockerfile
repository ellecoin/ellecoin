FROM node:16.14.0 AS build

ARG DEPLOY_ENV

COPY package.json .
COPY yarn.lock .

RUN yarn install --ignore-scripts
RUN npm rebuild node-sass

COPY . .
RUN if [ "$DEPLOY_ENV" = "prod" ]; then \
      yarn build; \
    elif [ "$DEPLOY_ENV" = "crypz" ]; then \
      yarn build:crypz; \
    elif [ "$DEPLOY_ENV" = "fury-staging" ]; then \
      yarn build:fury_staging; \
    elif [ "$DEPLOY_ENV" = "fury-crypz" ]; then \
      yarn build:fury; \
    else \
      yarn build:staging; \
    fi

#
FROM nginx:stable-alpine

ARG DEPLOY_ENV

COPY --from=build ./build /usr/share/nginx/html/react
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN if [ "$DEPLOY_ENV" = "fury-staging" ] || [ "$DEPLOY_ENV" = "fury-crypz" ]; then \
      sed -i 's/listen  80/listen  8080/g' /etc/nginx/conf.d/default.conf; \
    fi

RUN echo 'pong' > /usr/share/nginx/html/health_check

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]