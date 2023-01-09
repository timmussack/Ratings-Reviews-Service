# Ratings & Reviews Backend Service

- The purpose of this project was to create a high performance backend API designed to provide an efficient way to manage the ratings & reviews feature of an e-commerce website.

## Tech Stack
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node](https://img.shields.io/badge/-Node-9ACD32?logo=node.js&logoColor=white&style=for-the-badge)
![Express](https://img.shields.io/badge/-Express-DCDCDC?logo=express&logoColor=black&style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Nginx](https://img.shields.io/badge/-Nginx-white?logo=nginx&logoColor=green&style=for-the-badge)

## 

- Four csv files were provided at the beginning of the project. The relational structure of the data led me to choose Postgres as a Data Base Management system. I used sql script files help complete the ETL process programatically. I then wrote and tested sql queries to create, read and update on the data base. After indexing appropriate columns, queries ran around 5-35 ms. The slowest queries are SELECT reviews statements with over 50 records for the given product id.

- After the data base and queries were ready, I created a node server using express and pg (postgres-node). Controller functions were made to handle data base CRUD requests. I then used Artillery load test locally. After running Artillery tests while useing pm2 to create 2 node.js/express clusters I decided that node and not the data base was the bottle neck.

- Because of the Artillery tests using pm2 clusters, when I deployed this project to AWS, I decided to horizontally scale using 6 free tier Ubuntu EC2 instances. Two of five end points were tested with loader.io in order to comapre pre and post scaling performance.

## Scaling Architecture
<img src="Scaling_Plan_Ratings_Reviews.png" width=50% height=50%>

## Testing Results
#### 15 second loader.io test on post reviews endpoint
- The post reviews route achieved 1000 requests per second with a 0% error rate and an average response time of 127 ms. A total of 5.6MB of review data was sent from the client requests and saved to the data base.
  - Before scaling, this route would finish the same test with an average response time of 2312 ms with a 0% error rate.
  - The improvement from scaling resulted in a 94.5% decrease in client wait time while maintaining a 0% error rate.
<img src="Final Post Review Demo SDC.gif" width=50% height=50%>

#### 15 second loader.io test on get reviews endpoint
- The get reviews route achieved 500 requests per second with a 0% error rate and an average response time of 71 ms. A total of 84MB of review data was received by the client from the data base.
  - Before scaling, this route would finish the same test with an average response time of 2209 ms with a .2% timeout   error rate.
  - The improvement from scaling resulted in a 96.7% decrease in client wait time & while also achieving a 0% error rate from .2%.
<img src="Final Get Reviews Demo SDC.gif" width=50% height=50%>

## Other Optimizations 
- Used indexing to ensure data base queries were between 5-20 ms. Pre-indexing, some queries took 5000 ms.
- Increased max connections allowed on Postgres db from 100 to 200. This change was prompted by data base error during load testing.
- Increased the number of worker connections in Nginx. This change was prompted by Nginx error logs during load testing.
- Enabled and configured keep alive connections between Nginx and backend servers to minimize authentication hand shakes, this change was prompted by Nginx blog post.

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
