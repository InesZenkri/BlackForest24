// require("dotenv").config();
// const axios = require('axios');
// const fs = require('fs');
// const cheerio = require('cheerio');

function parseIngredientsList(input) {
  // Split the input string into individual lines
  const lines = input.split('\n');
  console.log(lines);
  // Process each line with parseIngredient and filter out any invalid lines
  const ingredients = lines.map(line => parseIngredient(line)).filter(Boolean);
  return ingredients;
}

function parseIngredient(line) {
  // Regular expression to match product, quantity, optional unit, and optional details
  const regex = /^-\s*(.+?)(?:,\s*(.+?))?;\s*(\d+)\s*([^\s,]+)?(?:,\s*(.+))?$/;
  const match = line.match(regex);

  // If the line matches the expected pattern, parse the fields
  if (match) {
    // console.log("match: ", match);
    // Combine the two possible details fields
    const combinedDetails = [match[2], match[5]].filter(Boolean).join(', ');

    return {
      product: match[1].trim(),
      quantity: match[3],
      unit: match[4] ? match[4].trim() : 'Stk.', // Default unit to 'Stk.' if none is specified
      details: combinedDetails || null // Combine both details parts and default to null if empty
    };
  } else {
    // Return null for lines that do not match the pattern
    return null;
  }
}

async function fetchPageContent(url) {
  try {
    // Fetch the page content
    const { data: html } = await axios.get(url);

    // Clean up whitespace and return the result
    return html;
  } catch (error) {
    console.error(`Error fetching content from ${url}:`, error.message);
    return null;
  }
}

// Define the query function
async function queryGPT(prompt) {
  try {
    const apiKey = 'sk-dCU3p2QSP-dU8QQ1gOrNMJJ8IRp62SzmCtsaXeudnRT3BlbkFJJuiuhhGgwv9Ah91tQ7Eadw_CljERqbRqLbzm2JG_YA';
    const endpoint = 'https://api.openai.com/v1/chat/completions';

    // Make a request to the GPT API
    const response = await axios.post(
      endpoint,
      {
        model: 'gpt-4-turbo', // Replace with your specific model (use 'gpt-4' if 'gpt-4-turbo' is unavailable)
        messages: [{role: 'user', content: 'Ich werde dir nun den Text-Inhalt einer Website für einen Kochrezept geben. Deine Aufgabe ist es mir die Zutaten, die ich kaufe muss zu sagen. Du solltest mir die Zutaten genau so sagen, wie sie in den Rezepten stehen. Falls die wörter falsch geschrieben sind dann korrigiere sie. Deine autwort muss ausschliesslich nur aus den Zutaten bestehen und keine weiteren Informationen oder sonstiges Text enthalten. Die Zutaten sollten als ein json format zurückgegeben werden. Zusatzinformationen sollten nicht enthalten sein. Die json rückmeldung sollten den Name des Zutats enthalten, sowie die Menge bzw. den Gewicht des produktes, die entsprechende Einheit und eventuelle extra details. Die json format sollte keine ```, new lines oder das Wort json enthalten. Die ausgabe sollte sofort von einem json.parse commande in js machbar sein. Der name darf keine sonderzeichen oder komma haben auch keine plural (n). Die Einträge in der json rückmeldung sollte das folgende Format haben : [{"name": "Name des Zutats", "menge": "menge oder gewicht des Zutats", "einheit": "einheit der menge"}, ...]'}, { role: 'user', content: prompt }], // The required format for /chat/completions
        max_tokens: 1000, // Adjust this as needed
        temperature: 0, // Optional: Controls the randomness of the response
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    // Extract and log the response data
    const answer = response.data;
    console.log(answer.choices[0].message.content);
    const ingredientList = JSON.parse(answer.choices[0].message.content);
    chrome.storage.local.set({ ingredientList }, () => {
      console.log("ingredientList saved to storage.");
    });
    // chrome.storage.local.set({ ingredientList: JSON.parse(answer.choices[0].message.content)});
    // localStorage.setItem("ingredientList", answer.choices[0].message.content);
    // console.log(localStorage.getItem("ingredientList"));

  } catch (error) {
    console.error('Error querying GPT:', error.response?.data || error.message);
  }
}

async function askGPT(recipe, preferences, prompt) {
  try {
    const apiKey = 'sk-dCU3p2QSP-dU8QQ1gOrNMJJ8IRp62SzmCtsaXeudnRT3BlbkFJJuiuhhGgwv9Ah91tQ7Eadw_CljERqbRqLbzm2JG_YA';
    const endpoint = 'https://api.openai.com/v1/chat/completions';

    // Make a request to the GPT API
    const response = await axios.post(
      endpoint,
      {
        model: 'gpt-4-turbo', // Replace with your specific model (use 'gpt-4' if 'gpt-4-turbo' is unavailable)
        messages: [{role: 'user', content: 'Gegeben die folgende Kochrezept in json format, Ich möchte aus der liste von produkten die meist passenden herausfinden. Du sulltest mir bis zu 5 indexen von der Liste zurückgeben, die für das Gericht geeignert sind. Dabei solltest du soweit wie möglich die folgende liste der Präferencen berücksichtigen. Gib mir nur bis zu fünf indexe zurück ohne jegliche text.'}, { role: 'user', content: recipe }, { role: 'user', content: preferences }, { role: 'user', content: prompt }], // The required format for /chat/completions
        max_tokens: 1000, // Adjust this as needed
        temperature: 0.0, // Optional: Controls the randomness of the response
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );
    // Extract and log the response data
    const answer = response.data;
    console.log(answer.choices[0].message.content);
    return answer.choices[0].message.content;
  } catch (error) {
    console.error('Error querying GPT:', error.response?.data || error.message);
  }
};

// fetchPageContent('https://www.chefkoch.de/rezepte/820481186558221/Zitronenkuchen.html').then(html => {
//   if (html) {
//     queryGPT(extractTextFromHTML(html));
//   } else {
//     console.log('Failed to fetch the page HTML.');
//   }
// });

