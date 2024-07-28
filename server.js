import express from "express";
import bodyParser from "body-parser";
import axios from "axios";


const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";
app.use(express.static("public")); //serve static files from 'public' directory

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Route to render the main page
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts`); //call the respective api
    console.log(response.data);
    return res.render("index.ejs", { posts: response.data }); //return the posts 
  } catch (error) {
    return res.status(500).json({ message: "Error fetching posts" }); //return that there was an error fetching the posts
  }
});

// Route to render the page when someone wants to make a new post
app.get("/new", (req, res) => {
  return res.render("modify.ejs", { heading: "New Post", submit: "Create Post" });
});

//Route to handle edit of a post
app.get("/edit/:id", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${req.params.id}`); //hit the endpoint of the api to edit a post with that particular id
    console.log(response.data);
    return res.render("modify.ejs", {
      heading: "Edit Post",
      submit: "Update Post",
      post: response.data,
    });
  } catch (error) {
   return  res.status(500).json({ message: "Error fetching post" });
  }
});

// Create a new post
app.post("/api/posts", async (req, res) => {
  try {
    const response = await axios.post(`${API_URL}/posts`, req.body); //call the respective api to post a new post and pass the data to be posted
    console.log('Api response',response.data);
    return res.redirect("/"); //redirect to home page when new post is posted
  } catch (error) {
    return res.status(500).json({ message: "Error creating post" }); //otherwise tell that error occured while creating a post
  }
});

// Partially update a post
app.post("/api/posts/:id", async (req, res) => {
  console.log("called");
  try {
    //call the api to handle editing a particular post
    const response = await axios.patch(
      `${API_URL}/posts/${req.params.id}`,
      req.body
    );
    console.log(response.data);
    return res.redirect("/"); //redirect to home once you return from the api call
  } catch (error) {
    return res.status(500).json({ message: "Error updating post" }); //send the error message that error occured during updating
  }
});

// Delete a post
app.get("/api/posts/delete/:id", async (req, res) => {
  try {
    await axios.delete(`${API_URL}/posts/${req.params.id}`); //call the api responsible for deleting a post
    return res.redirect("/"); //redirect to home page
  } catch (error) { 
    return res.status(500).json({ message: "Error deleting post" });
  }
});

app.listen(port, () => {//start the backend server that makes the api calls
  console.log(`Backend server is running on http://localhost:${port}`);
});
