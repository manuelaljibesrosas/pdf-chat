import axios from "axios";

export const MESSAGE_TYPES = {
  BOT: "BOT",
  USER: "USER",
  ERROR: "ERROR",
} as const;

export type Message = {
  message: {
    type: (typeof MESSAGE_TYPES)[keyof typeof MESSAGE_TYPES];
    text: string;
    citations: string[];
    confidence_score: string;
  };
};

export const fetchResponse = async (question: string) => {
  try {
    const { data } = await axios.post<{
      message: Omit<Message["message"], "type">;
    }>(
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

    return { type: MESSAGE_TYPES.BOT, ...data.message };
  } catch (error) {
    return {
      type: MESSAGE_TYPES.ERROR,
      text: "Something went wrong",
      citations: [],
      confidence_score: "",
    };
  }
};
