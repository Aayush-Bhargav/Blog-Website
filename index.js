import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';
import dotenv from 'dotenv'
const app = express();
// Load environment variables from .env file
dotenv.config();
const port = 4000;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "info",
  password: process.env.PASSWORD,
  port: 5432,
});
db.connect();//connect to the database
async function getPosts() {//function to get all the blog posts
  const result = await db.query("SELECT * FROM posts;");
  return result.rows;
}
let posts = await getPosts(); //get the initial posts from the database


// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


// GET All posts
app.get("/posts", (req, res) => {
   return res.json(posts);
});

// GET a specific post by id
app.get("/posts/:id", (req, res) => {
  let id = Number.parseInt(req.params.id); //get the id from the req.params
  let post;
  let flag = 0;
  for (let i = 0; i < posts.length; i++) {
    if (posts[i].id === id) {
      post = posts[i]; //set the post to the post you needed to get
      flag = 1;
      break;
    }
  }
  if (flag) { //this means post is valid
     return res.json(post); //so return  this post
  }
  else {
     return res.status(404).json({ message: 'Post with the id does not exist' }) //else return an error saying that post does not exist
  }
})

//POST a new post
app.post('/posts', async (req, res) => {
  try {
    //set the title, content and author
    let title = req.body.title;
    let content = req.body.content;
    let author = req.body.author;
    let date = new Date(); //set the date to the current date
    //insert the new post into our posts table
    const result = await db.query("INSERT INTO posts (title,content,author,date) VALUES ($1,$2,$3,$4);", [title, content, author, date]);
    posts = await getPosts(); //update the posts array
    console.log(posts)
    return res.status(201).json({title,author,content,date});//return this status
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }

});

// PATCH a post when you just want to update one parameter
app.patch('/posts/:id', async (req, res) => {
  try {

    let id = Number.parseInt(req.params.id); //get the id of the post you want to update/patch
    let flag = 0;
    let index = -1;
    for (let i = 0; i < posts.length; i++) { //try to find a post with that id
      if (posts[i].id === id) {
        flag = 1;
        index = i;
      }
    }
    if (flag == 0) //this means post could not be find so id is invalid
      return res.status(404).json({ error: 'Could not find the post to update!' });
    else { //means id is valid and you have found that particular post to update
      let post = posts[index];
      let mini = 0;
      if (req.body.title !==post.title) {
        post.title = req.body.title;
        mini = 1;
      }
      if (req.body.content !== post.content) {
        post.content = req.body.content;
        mini = 1;
      }
      if (req.body.author !==post.author) {
        post.author = req.body.author;
        mini = 1;
      }
      if (mini == 1) { //this 'mini' keeps track of whether any field was actually updated and if it was , it updates the time to the current time
        post.date = new Date();
      }
    
      //try updating the post in the database
      const result = await db.query("UPDATE posts SET title=$1, author=$2, content=$3, date=$4 WHERE id=$5", [post.title, post.author, post.content, post.date, id]);
      posts = await getPosts();//update posts array
      return res.sendStatus(200);
    }
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Could not update the post!' });
  }

});

// DELETE a specific post by providing the post id.
app.delete('/posts/:id', async (req, res) => {
  try {
    let id = Number.parseInt(req.params.id);
    let flag = 0;
    let index = -1;
    for (let i = 0; i < posts.length; i++) { //try to find if post with that id actually exists or not
      if (posts[i].id === id) {
        flag = 1;
        index = i;
        break;
      }
    }
    if (flag == 0) //this means id is invalid
      return res.status(404).json({ error: 'Could not find the post to delete!' });
    else {//this means id is valid and you have found the post to delete
      //delete the post from the database
      const result = await db.query("DELETE FROM posts WHERE id=($1);", [id]);
      posts = await getPosts();//get the updated posts list
      return res.sendStatus(200);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Could not delete the post!' });
  }

});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
