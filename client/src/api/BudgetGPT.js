//BudgetGPT.js
export const submitChatQuestion = async (question, creationDateTime) => {
  try {
    const requestBody = {
      question,
      creationDateTime: creationDateTime || new Date().toISOString(), // Set creationDateTime to current date and time if it's null
    };

    const response = await fetch('/api/question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      return await response.json();
    } else if (response.status === 400) {
      const errorResponse = await response.json();
      return { response: errorResponse.error };
    } else {
      throw new Error(`Request failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error submitting chat question:', error);
    throw error;
  }
};


export const fetchChatHistory = async () => {
  try {
    const response = await fetch('/api/chat-history/latest');
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error(`Failed to fetch chat history: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
};

export const fetchChatHistoryList = async () => {
  const response = await fetch('/api/chat-history-list');
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`Failed to fetch chat history list: ${response.statusText}`);
  }
};

export const renameChatHistory = async (oldFileName, newName) => {
  const response = await fetch('/api/rename-chat-history', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ oldFileName, newName }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Error renaming chat history: ${error.message}`);
  }
};

