## Third-Party Dependencies
This project uses third-party libraries and external APIs (e.g., OpenAI). Their respective licenses and terms of service apply. This project is licensed under MIT, but usage of third-party services must comply with their own terms.

This application was inspired by my need to use GPT4 API calls ad-hoc rather than paying a monthly fee for Chat GPT.

The client side leverages react-syntax-highlighter for creating code blocks.

Requirements:

1. Clone repo and install dependencies
2. Create a development.env file and populate a variable for OPENAI_API_KEY
3. Run "npm run startdev" to run in development mode.
4. To change the model or system instructions you will need to update the services\openaiService.js file as needed.

All files are stored locally within the project directory utilizing the file system.