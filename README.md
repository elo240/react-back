# react-back
Mysql
Database model:
  user:
        -id int primary key auto_increment
        -username varchar(30)
        -emial varchar(50)
        -passwrod varchar(100)
  post:
        -id int primary key auto_increment
        -body varchar(240)
        -user_id int
