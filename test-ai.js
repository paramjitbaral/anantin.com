const { streamText } = require('ai');
const { createOpenAI } = require('@ai-sdk/openai');
const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: 'test',
});

async function run() {
  const result = await streamText({
    model: openrouter('meta-llama/llama-3.1-8b-instruct:free'),
    messages: [{role: 'user', content: 'test'}]
  });
  console.log(Object.keys(result));
}
run();
