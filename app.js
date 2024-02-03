import express from "express";
import {getPrompts} from "./public/scripts/utils.js";

const app = express();

//setting the view engine as EJS.
app.set("view engine", "ejs");

//roots the views directory to public
app.set("views", "public");

//tells express that the public folder is the static folder
app.use(express.static("public"));

//home route
app.get("/", function(req, res)
{
  res.render("./pages/index");
});

app.get("/getData", async(req, res) =>
{
  try
  {
    const prefixTerms = req.query.prefixes.split(",");
    const pages = [1, 2, 3, 4, 5];
    const perPage = 50;
    const responseData = [];

    for(const prefixTerm of prefixTerms)
    {
      const storeObj = {prefixTerm, skus: []};
      for(const page of pages)
      {
        const apiUrl = `https://www.1mg.com/pharmacy_api_gateway/v4/drug_skus/by_prefix?prefix_term=${prefixTerm}&page=${page}&per_page=${perPage}`;
        const response = await fetch(apiUrl);
        const result = await response.json();
        let skus = result?.data?.skus;
        if(skus)
        {
          const prompts = getPrompts(skus);
          storeObj.skus.push(...prompts);
        }

      }
      responseData.push(storeObj);
    }

    res.json(responseData);
  }
  catch(error)
  {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, function()
{
  console.log("SERVER STARTED ON localhost:3000");
});
