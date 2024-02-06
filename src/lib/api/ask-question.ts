import axios from "axios";

export type Message = {
  message: {
    text: string;
    citations: string[];
    confidence_score: string;
  };
};

export const fetchResponse = async (question: string) => {
  const { data } = await axios.post<Message>(
    "https://prosper-conversations-beta.onrender.com/assistant/ask_question",
    {
      question,
    },
    {
      headers: {
        "X-Api-Key": "test-challenge",
        "X-Organization": "test",
      },
    }
  );

  return data.message;
};
