import { createContext, useContext, useEffect, useState } from "react";
import { recipesOptions, dataFetchAll, fetchData } from "../utils/data";

export const stateDataContext = createContext();

export const StateContext = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [inputSearch, setInputSearch] = useState("");
  const [recipeDetails, setRecipeDetails] = useState({});
  const [nutritionData, setNutritionData] = useState([]);
  const [stepsData, setStepsData] = useState([]);
  const [recipesVideos, setRecipesVideos] = useState([]);
  const [goodNutrients, setGoodNutrients] = useState([]);
  const [badNutrients, setBadNutrients] = useState([]);
  const [search, setSearch] = useState(false);
  const [id, setId] = useState(null);

  const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?query=${inputSearch}&number=20`;

  useEffect(() => {
    const handleData = async () => {
      const data = await fetchData(url, recipesOptions);
      setRecipes(data.results)
    }
    handleData();
  },[search])

  const recipesSearch = [
    `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${id}/information`,
    `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${id}/nutritionWidget.json`,
    `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${id}/analyzedInstructions`,
  ]

  useEffect(() => {
    if(!id) return;
    const handleFetch = async () => {
      const data = await dataFetchAll(recipesSearch, recipesOptions);
      setRecipeDetails(data[0].value)
      setNutritionData(data[1].value)
      setGoodNutrients(data[1].value.good)
      setBadNutrients(data[1].value.bad)
      setStepsData(data[2].value[0].steps)
    } 
    handleFetch()
  }, [id, recipeDetails.title])

  const videoUrl = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/videos/search?query=${recipeDetails.title}`

  useEffect(()=> {
    if(!id) return
    const handleVideos = async () => {
    const data = await fetchData(videoUrl, recipesOptions) 
    setRecipesVideos(data?.videos)
    }
    handleVideos()
  },[id, recipeDetails.title])
  
  const valueContext = {
    recipes,
    setRecipes,
    inputSearch,
    setInputSearch,
    recipeDetails,
    nutritionData,
    setNutritionData,
    stepsData,
    setStepsData,
    recipesVideos,
    setRecipesVideos,
    goodNutrients,
    setGoodNutrients,
    badNutrients,
    setBadNutrients,
    setSearch,
    search,
    setId
  }

  return (
    <stateDataContext.Provider value={valueContext} >
      {children}
    </stateDataContext.Provider>
  );
};

export const useStateDataContext = () => {
  const context = useContext(stateDataContext);
  return context;
};
