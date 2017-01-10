FROM daocloud.io/nginx
MAINTAINER hookszhang hua.zhang@boyuanitsm.com
EXPOSE 80
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY dist /usr/share/nginx/html
