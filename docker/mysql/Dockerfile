FROM mysql:8.0.33

EXPOSE 3326

ENV MYSQL_ROOT_PASSWORD=password
ENV MYSQL_DATABASE=test
ENV MYSQL_USESR=root
ENV MYSQL_PASSWORD=mypassword
ENV TZ=Asia/Seoul

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone