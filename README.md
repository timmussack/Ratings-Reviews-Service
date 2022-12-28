# Ratings-Reviews-Service

The purpose of this project is to create a high performance backend API
designed to provide an efficient way to manage the ratings & reviews feature of an e-commerce website.

# Technology
Postgres
Node.js
Express

# Commands for ETL (Extract, Transform & Load) process
Check if postgresql server is running locally
brew services

Start the postgresql server if it isn't already running
brew services restart postgresql@15

Stop postgresql server
brew services stop postgresql

Opens postgres in terminal with user 'sdc'
psql postgres -U sdc

Stops postgres in terminal
\q

Switch to db of choice
\c sdc_reviews

Show tables in db
\dt

Run from setup_tables.sql directory to clean data base and create tables
psql -U sdc -d sdc_reviews -a -f setup_tables.sql

Run from load_tables.sql directory to load csv data into data base tables
psql -U sdc -d sdc_reviews -a -f load_tables.sql