
import { GoogleGenAI, Type } from "@google/genai";
import { SessionData, EvaluationResult, QuestionType, UserAnswers, Question } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const readingSessionSchema = {
  type: Type.OBJECT,
  properties: {
    passage: {
      type: Type.STRING,
      description: "A 300-400 word article on the given topic, suitable for a 14-year-old student. The tone should be informative and engaging."
    },
    questions: {
      type: Type.ARRAY,
      description: "An array of 4 questions based on the passage.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "A unique identifier for the question, e.g., 'q1'." },
          type: { 
            type: Type.STRING, 
            description: `The type of question. Must be one of: "${QuestionType.Explicit}", "${QuestionType.Implicit}", "${QuestionType.Critical}", "${QuestionType.Vocabulary}".`
          },
          questionText: { type: Type.STRING, description: "The text of the question." },
          options: {
            type: Type.ARRAY,
            description: "An array of 4 multiple-choice options. This should be null for the 'Critical Thinking' question type.",
            items: { type: Type.STRING }
          },
          correctAnswer: { 
            type: Type.STRING, 
            description: "The correct answer. For multiple choice, it's one of the options. For open-ended questions, it's a model answer." 
          }
        },
        required: ["id", "type", "questionText", "correctAnswer"]
      }
    }
  },
  required: ["passage", "questions"]
};

export const generateReadingSession = async (topic: string): Promise<SessionData> => {
  const prompt = `
    You are an AI assistant for an educational platform. Your task is to help a 14-year-old student named Hana improve her reading comprehension.
    
    Please generate a complete reading session based on the topic: "${topic}".
    
    The session must include:
    1.  A reading passage of about 300-400 words. It should be informative, well-structured, and written at a level appropriate for a 14-year-old.
    2.  Exactly four questions based on the passage, with one question for each of the following types:
        -   '${QuestionType.Explicit}': Asks about information stated directly in the text.
        -   '${QuestionType.Implicit}': Asks the reader to infer meaning that is not directly stated.
        -   '${QuestionType.Critical}': Asks for an opinion, evaluation, or real-world application of the text's ideas. This must be an open-ended question (no multiple-choice options).
        -   '${QuestionType.Vocabulary}': Asks for the meaning of a specific word from the passage in its context.

    For all multiple-choice questions, provide 4 plausible options, with only one being correct.
    For the critical thinking question, provide a model answer as the 'correctAnswer'.

    Return the entire session as a single JSON object matching the provided schema. Ensure the question IDs are 'q1', 'q2', 'q3', and 'q4'.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: readingSessionSchema,
    },
  });

  const jsonResponse = JSON.parse(response.text);
  // Ensure question types are correctly cast from string
  jsonResponse.questions.forEach((q: any) => {
    q.type = q.type as QuestionType;
  });
  return jsonResponse as SessionData;
};

const evaluationSchema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.INTEGER, description: "The number of questions answered correctly." },
    totalQuestions: { type: Type.INTEGER, description: "The total number of questions, which should be 4." },
    strengths: { type: Type.STRING, description: "A brief, encouraging summary (1-2 sentences) of what the student did well, based on their correct answers." },
    areasForGrowth: { type: Type.STRING, description: "A brief, constructive summary (1-2 sentences) of areas for improvement, based on their incorrect answers." },
    feedback: {
      type: Type.ARRAY,
      description: "An array of feedback objects, one for each question.",
      items: {
        type: Type.OBJECT,
        properties: {
          questionId: { type: Type.STRING },
          questionText: { type: Type.STRING },
          userAnswer: { type: Type.STRING },
          isCorrect: { type: Type.BOOLEAN },
          explanation: { type: Type.STRING, description: "A clear, concise explanation for why the user's answer is correct or incorrect. For incorrect answers, gently correct the misunderstanding and explain the right answer with reasoning from the text." }
        },
        required: ["questionId", "questionText", "userAnswer", "isCorrect", "explanation"]
      }
    },
    recommendations: {
      type: Type.ARRAY,
      description: "An array of 2 recommended new article topics, slightly above the student's current level, to practice skills related to their areas for growth.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "The title of the recommended article." },
          reason: { type: Type.STRING, description: "A short reason why this article is recommended (e.g., 'To practice inference skills')." }
        },
        required: ["title", "reason"]
      }
    }
  },
  required: ["score", "totalQuestions", "strengths", "areasForGrowth", "feedback", "recommendations"]
};

export const evaluateAnswers = async (passage: string, questions: Question[], answers: UserAnswers): Promise<EvaluationResult> => {
  const prompt = `
    You are an AI assistant evaluating a 14-year-old student's reading comprehension answers.
    
    Here is the context:
    
    **Reading Passage:**
    ---
    ${passage}
    ---
    
    **Questions and Correct Answers:**
    ---
    ${JSON.stringify(questions, null, 2)}
    ---
    
    **Student's Answers:**
    ---
    ${JSON.stringify(answers, null, 2)}
    ---
    
    Your task is to evaluate the student's answers and provide comprehensive feedback.
    
    Instructions:
    1.  Compare each student answer with the correct answer for that question. For the "Critical Thinking" question, be more flexible and assess if the student's reasoning is sound, even if it doesn't match the model answer perfectly.
    2.  Calculate the total score.
    3.  Write a summary of the student's strengths and areas for growth based on the types of questions they got right or wrong.
    4.  Provide detailed, question-by-question feedback. The explanation should be supportive and educational.
    5.  Suggest two new article topics to help them practice their weaker skills.
    
    Return the entire evaluation as a single JSON object matching the provided schema.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: evaluationSchema,
    },
  });

  return JSON.parse(response.text) as EvaluationResult;
};
