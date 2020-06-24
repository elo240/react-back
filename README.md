# react-back
###Mysql
Database model:
  #####user:
        *id int primary key auto_increment
        *username varchar(30)
        *email varchar(50)
        *password varchar(100)
  #####post:
        *id int primary key auto_increment
        *body varchar(240)
        *user_id int
