import OpenAI from "openai";
import fs from "fs";
import { parse } from "csv-parse/sync";

// Load your CSV data
const csvData = fs.readFileSync(
  "data/cluster_centers_vulnerability.csv",
  "utf8"
);
const records = parse(csvData, { columns: true });
const csvContent = JSON.stringify(records);

// Query openai
const openai = new OpenAI({
  // apiKey: // enter your key here
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "Assistant is a large language model trained by OpenAI. You are a helpful assistant designed to output JSON. You are an expert for interpreting machine learning outcomes, especially in the context of urban planning, your focus is on analyzing and labeling clusters from k-means clustering. You translate the values of variables within these k-means clusters into understandable, human language labels. This process involves examining the distinctive characteristics of each cluster, understanding the significance of each variable within the context of urban fabrics, and then formulating descriptive labels that accurately reflect the underlying patterns and relationships. I will provide you a JSON containing four objects representing clusters with numeric values for cluster centers means from k-means clustering. I want you to label each cluster with meaningful names based on numeric values",
      },
      {
        role: "assistant",
        content:
          '{"clusters": [{"lable": "label for cluster1", "reasoning": "reasoning for the cluster1 label"}, {"lable": "label for cluster2", "reasoning": "reasoning for the cluster2 label"}, {"lable": "label for cluster3", "reasoning": "reasoning for the cluster3 label"}, {"lable": "label for cluster4", "reasoning": "reasoning for the cluster4 label"}]',
      },
      { role: "user", content: csvContent },
    ],
    model: "gpt-3.5-turbo",
    response_format: { type: "json_object" },
  });

  console.log(completion.choices[0].message.content);
}
main();
