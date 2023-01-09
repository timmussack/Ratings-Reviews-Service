# Ratings & Reviews Backend Service

- The purpose of this project was to create a high performance backend API designed to provide an efficient way to manage the ratings & reviews feature of an e-commerce website.

- This project was deployed to AWS, horizontally scaled using 6 free tier Ubuntu EC2 instances and 2 end points were tested with loader.io.

## Scaling Architecture
<img src="ScalingArchitecture.png">

> Results of 15 second test
- Post reviews achieved 1000 RPS with a 0% error rate and an average response time of 127 ms while sending a total of 5.6MB of data.
- Before optimization & scaling this route had an average response time of 784 ms on the same test.

- Get reviews achieved 500 RPS with a 0% error rate and an average response time of 71 ms while receiving a total of 84MB of data.
 - Before optimization & scaling this route struggled on  100 RPS with an average response time of 1600 ms and an error rate of 4%.

## Optimizations Made
- Used indexing to ensure data base queries were under between 5-20 ms.
- Scaled using multiple node.js servers and a Nginx load balancer.
- Increased max connections allowed on data base from 100 to 200, prompted by data base error.
- Increased the number of worker connections in Nginx, prompted by Nginx error logs.
- Enabled keep alive connections in Nginx to minimize authentication hand shakes, prompted by Nginx blog post.

## Technologies
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node](https://img.shields.io/badge/-Node-9ACD32?logo=node.js&logoColor=white&style=for-the-badge)
![Express](https://img.shields.io/badge/-Express-DCDCDC?logo=express&logoColor=black&style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Nginx](https://img.shields.io/badge/-Nginx-white?logo=nginx&logoColor=green&style=for-the-badge)

## Helpful Postgres & ETL Commands

#### Check if postgresql server is running locally
> brew services

#### Start the postgresql server if it isn't already running
> brew services restart postgresql@15

#### Stop postgresql server
> brew services stop postgresql

#### Set expanded view to auto (on, off are also options)
> \x auto

#### Turn on timing to benchmark queries in psql (terminal)
> \timing

#### Opens postgres in terminal with user 'sdc',
> psql -U 'user name' 'data base name'

#### Stops postgres in terminal
> \q

#### Switch to db of choice
> \c data 'base name'

#### Show tables in db
> \dt

#### Describe a table with extra information
> \d+ 'table name'

#### Return number of rows in a table
> SELECT count(*) FROM 'table name';

#### Run sql file scripts in build_db folder to set up data base
> psql -U 'user name' -d 'data base name' -a -f 'file name'.sql

#### Check what index's a table has
> SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'table name';

#### If primary key sequence falls out of synce run the fix_sequences script
> psql -U 'user name' -d 'data base' -a -f fix_sequences.sql;

#### Create pgsql file of the data base to transfer data base to cloud server
> pg_dump -U 'user name' -f 'name the file'.pgsql -C 'data base name'

#### Send the pgsql file to cloud server using scp
> scp -i ~'path to pem key' 'pem key file name'.pem 'pgsql file name'.pgsql 'location of cloud server'
