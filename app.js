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

app.get("/cards", function(req, res)
{
  res.json({
    "cardList": [
      {
        "cardNumber": "1217152175616051",
        "cardNumberVisible": false,
        "cardFreeze": false,
        "cardValidThru": "2/27",
        "cardCVV": 117,
        "nameOnCard": "Tony stark",
        "purpose": "Facebook ads",
        "cardColor": "black",
        "availableBalance": "2000",
        "currencyUnits": "USD",
        "weeklySpendingLimit": "2000",
        "weeklySpendingLimitExhausted": false
      },
      {
        "cardNumber": "8246322112295862",
        "cardNumberVisible": false,
        "cardFreeze": false,
        "cardValidThru": "8/29",
        "cardCVV": 890,
        "nameOnCard": "Henry Jonathan",
        "purpose": "Google ads",
        "cardColor": "blue",
        "availableBalance": "5000",
        "currencyUnits": "USD",
        "weeklySpendingLimit": "5000",
        "weeklySpendingLimitExhausted": false
      },
      {
        "cardNumber": "2130733425843287",
        "cardNumberVisible": false,
        "cardFreeze": false,
        "cardValidThru": "7/20",
        "cardCVV": 507,
        "nameOnCard": "Anthony Edward ",
        "purpose": "Marketing",
        "cardColor": "red",
        "availableBalance": "10000",
        "currencyUnits": "USD",
        "weeklySpendingLimit": "10000",
        "weeklySpendingLimitExhausted": false
      },
      {
        "cardNumber": "7786225647633095",
        "cardNumberVisible": false,
        "cardFreeze": false,
        "cardValidThru": "10/24",
        "cardCVV": 681,
        "nameOnCard": "Bruce Banner",
        "purpose": "Dinner",
        "cardColor": "orange",
        "availableBalance": "5000",
        "currencyUnits": "USD",
        "weeklySpendingLimit": "5000",
        "weeklySpendingLimitExhausted": false
      },
      {
        "cardNumber": "5030077555167982",
        "cardNumberVisible": false,
        "cardFreeze": false,
        "cardValidThru": "4/29",
        "cardCVV": 814,
        "nameOnCard": "Hawkeye",
        "purpose": "Laptop",
        "cardColor": "green",
        "availableBalance": "90000",
        "currencyUnits": "USD",
        "weeklySpendingLimit": "90000",
        "weeklySpendingLimitExhausted": false
      }
    ],
    "selectedCard": "5030077555167982"
  }
  );
});

app.get("/getData", async(req, res) =>
{
  try
  {
    const prefixTerms = req.query.start.split(",");
    const pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const perPage = 50;
    const responseData = [];

    for(const prefixTerm of prefixTerms)
    {
      const storeObj = {prefixTerm, skus: []};
      for(const page of pages)
      {
        const apiUrl = `https://www.1mg.com/pharmacy_api_gateway/v4/drug_skus/by_prefix?prefix_term=${prefixTerm}&page=${page}&per_page=${perPage}`;
        try
        {
          const response = await fetch(apiUrl);
          const result = await response.json();
          let skus = result?.data?.skus;
          if(skus)
          {
            const prompts = getPrompts(skus);
            storeObj.skus.push(...prompts);
          }
        }
        catch(e)
        {
          //
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
