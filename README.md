# Blog Website

This is a very simple blog website that allows users to create, read, update, and delete blog posts. The project is built using Node.js, Express, PostgreSQL, and EJS for templating.

## Installation

 Clone the repository
   ```
   git clone https://github.com/Aayush-Bhargav/Blog-Website.git
   cd Blog-Website
   ```
Install dependencies
```
npm install
```
## Set up PostgreSQL database

1. Create a PostgreSQL database named `info`.

2. Create a `posts` table using the following SQL:

    ```
    CREATE TABLE posts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      content TEXT NOT NULL,
      author TEXT NOT NULL,
      date TIMESTAMPTZ NOT NULL
    );
    ```
