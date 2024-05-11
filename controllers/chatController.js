const fs = require('fs');
const path = require('path');
const { getOpenAIResponse } = require('../services/openaiService');

const renameChatHistory = (req, res) => {
    const { oldFileName, newName } = req.body;
    const serverDataPath = path.join(__dirname, '..', 'serverdata');
    const oldFilePath = path.join(serverDataPath, oldFileName);
    const newFileName = newName + oldFileName.substring(oldFileName.lastIndexOf('_'));
    const newFilePath = path.join(serverDataPath, newFileName);
  
    if (fs.existsSync(oldFilePath)) {
      fs.renameSync(oldFilePath, newFilePath);
      res.json({ message: 'Chat history renamed successfully.' });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
};

const handleQuestion = async (req, res) => {
    const { question, creationDateTime } = req.body;
  
    if (!question) {
      return res.status(400).json({ error: 'Question is required.' });
    }
  
    try {
      const response = await getOpenAIResponse(question, creationDateTime);
      res.json({ response });
    } catch (error) {
      console.error('Error:', error);
      const statusCode = error.message === 'Question is required.' ? 400 : 500;
      res.status(statusCode).json({ error: error.message });
    }
};

const listChatHistoryFiles = (req, res) => {
    const serverDataPath = path.join(__dirname, '..', 'serverdata');
    try {
        const files = fs.readdirSync(serverDataPath).filter(file => file !== '.gitignore');
        res.json(files);
    } catch (error) {
        console.error('Error retrieving files:', error);
        res.status(500).json({ error: 'Failed to retrieve files' });
    }
};

const getLatestChatHistory = (req, res) => {
    const serverDataPath = path.join(__dirname, '..', 'serverdata');
    try {
      const files = fs.readdirSync(serverDataPath)
                      .filter(file => file !== '.gitignore')
                      .sort()
                      .reverse();
      console.log('Files in serverdata:', files);
      if (files.length > 0) {
        const latestFile = files[0];
        console.log('Latest file:', latestFile);
        const filePath = path.join(serverDataPath, latestFile);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        res.json(JSON.parse(fileContent));
      } else {
        res.status(404).json({ error: 'File not found' });
      }
    } catch (error) {
      console.error('Error retrieving latest file:', error);
      res.status(500).json({ error: 'Failed to retrieve file' });
    }
};

const viewChatHistory = (req, res) => {
    const serverDataPath = path.join(__dirname, '..', 'serverdata');
    const filePath = path.join(serverDataPath, req.params.fileName);
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        res.json(JSON.parse(fileContent));
      } catch (error) {
        console.error('Error reading file:', error);
        res.status(500).json({ error: 'Error reading file' });
      }
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  };

module.exports = { renameChatHistory, handleQuestion, listChatHistoryFiles, getLatestChatHistory, viewChatHistory };
