// Bring in Express code
const express = require('express')

const app = express()
const port = 3000

app.use(express.json()) // This line is necessary for Express to be able to parse JSON in request body's

const favoriteMovieList = [{
  title: "Star Wars",
  starRating: 5,
  isRecommended: true,
  createdAt: new Date(),
  lastModified: new Date()
}, {
  title: "The Avengers",
  starRating: 4,
  isRecommended: true,
  createdAt: new Date(),
  lastModified: new Date()
}];

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get("/all-movies", (req, res)=>{

    const starRating = parseInt(req.query.starRating);

    if(req.query.starRating === undefined){
        res.json({
            success: true,
            favoriteMovieList: favoriteMovieList
        })
        return;
    }

    
    if (typeof(starRating) !== "number"){
        res.json({
            success: false,
            message: "Star Rating must be a number."
        })
        return;
    }
	const filteredMovies = favoriteMovieList.filter((movies)=>{
        return movies.starRating < starRating
    })

	res.json({
		success: true,
		filteredMovies: filteredMovies
	})
})


app.get("/single-movie/:titleToFind", (req, res)=>{

    let foundMovie = [];
	favoriteMovieList.forEach((movie)=>{
        if(movie.title === req.params.titleToFind)
            foundMovie.push(movie)
    })

	res.json({
		success: true,
		foundMovie : foundMovie
	})
})


app.put("/new-movie", (req, res)=> {
    
    if(req.body.title === undefined || typeof(req.body.title) !== "string"){
        res.json({
            success: false,
            message: "Title must be a string."
        })
        return;
    }
    if(req.body.starRating === undefined || typeof(req.body.starRating) !== "number"){
        res.json({
            success: false,
            message: "Star Rating must be a number."
        })
        return;
    }
    if(req.body.isRecommended === undefined || typeof(req.body.isRecommended) !== "boolean"){
        res.json({
            success: false,
            message: "Recommendation must be a boolean."
        })
        return;
    }
    
    const newMovie ={}
    newMovie.title = req.body.title;
    newMovie.starRating = req.body.starRating;
    newMovie.isRecommended = req.body.isRecommended;
    newMovie.createdAt = new Date();
    newMovie.lastModified = new Date();

    favoriteMovieList.push(newMovie);


    res.json({
		success: true
	})

})

app.put("/update-movie/:titleToUpdate", (req, res)=> {

    const titleToUpdate = req.params.titleToUpdate;

    const originalMovieIndex = favoriteMovieList.findIndex((movie)=>{
		return movie.title === titleToUpdate
	})
    let originalMovie = favoriteMovieList[originalMovieIndex];

    let updatedMovie ={};


    if(req.body.title !== undefined && typeof(req.body.title) === "string"){
        updatedMovie.title = req.body.title;
    }else{
        res.json({
            success: false,
            message: "Title must be a string."
        })
        updatedMovie.title = originalMovie.title
    }
    if(req.body.starRating !== undefined && typeof(req.body.starRating) === "number"){
        updatedMovie.starRating = req.body.starRating;
    }else{
        res.json({
            success: false,
            message: "Title must be a string."
        })
        updatedMovie.starRating = originalMovie.starRating
    }
    if(req.body.isRecommended !== undefined && typeof(req.body.isRecommended) === "boolean"){
        updatedMovie.isRecommended = req.body.isRecommended;
    }else{
        res.json({
            success: false,
            message: "Title must be a string."
        })
        updatedMovie.isRecommended = originalMovie.isRecommended
    }
    updatedMovie.createdAt = originalMovie.createdAt
   
    updatedMovie.lastModified = new Date();

    favoriteMovieList[originalMovieIndex] = updatedMovie;

    res.json({
		success: true,
        message: favoriteMovieList[originalMovieIndex].starRating
	})

})

app.delete("/delete-movie/:titleToDelete", (req, res)=> {

    const titleToDelete = req.params.titleToDelete;

    const deleteMovieIndex = favoriteMovieList.findIndex((movie)=>{
		return movie.title === titleToDelete
	})
    
    favoriteMovieList.splice(deleteMovieIndex, 1);

    res.json({
		success: true,
	})

})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})