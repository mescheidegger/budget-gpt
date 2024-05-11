const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getOpenAIResponse = async (question, creationDateTime) => {
  const serverDataPath = path.join(__dirname, '..', 'serverdata');
  const dateTimeFileName = `_${creationDateTime.replace(/:/g, '-')}.json`;
  const filePaths = fs.readdirSync(serverDataPath).map(fileName => path.join(serverDataPath, fileName));
  const matchingFilePath = filePaths.find(filePath => filePath.endsWith(dateTimeFileName));

  // Ensure the serverdata directory exists
  if (!fs.existsSync(serverDataPath)) {
    fs.mkdirSync(serverDataPath);
  }

  let conversation;

  // Check if the conversation file exists
  if (matchingFilePath) {
    // Existing chat: read the conversation file
    const fileContent = fs.readFileSync(matchingFilePath, 'utf8');
    conversation = JSON.parse(fileContent);
  } else {
    // New chat: create a new conversation object with "chat_" prefix
    conversation = {
      createddt: creationDateTime,
      updateddt: new Date().toISOString(),
      messages: [
        { role: "system", content: "You are a professional javascript developer who leans toward best practice and always provides full code responses."}
      ]
    };
    // Use the "chat_" prefix for the new chat file name
    fs.writeFileSync(path.join(serverDataPath, `chat${dateTimeFileName}`), JSON.stringify(conversation, null, 2));
  }

  // Add the user's question to the conversation
  conversation.messages.push({ role: 'user', content: question });

  try {
    // Get response from OpenAI
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: conversation.messages,
      user: "system"
    });
    const assistantResponse = { role: 'assistant', content: chatCompletion.choices[0].message.content.trim() };

    // Update the conversation with the assistant's response and the new updateddt
    conversation.messages.push(assistantResponse);
    conversation.updateddt = new Date().toISOString();
    fs.writeFileSync(matchingFilePath || path.join(serverDataPath, `chat${dateTimeFileName}`), JSON.stringify(conversation, null, 2));

    return assistantResponse.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
};

module.exports = { getOpenAIResponse };
