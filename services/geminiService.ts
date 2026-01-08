
import { GoogleGenAI, Modality } from "@google/genai";
import { GameMode } from "../types";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is missing. AI features will be disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getAiFeedback = async (score: number, total: number, selectedTable: number, mode: GameMode) => {
  const ai = getAIClient();
  if (!ai) return getDefaultFeedback(score, total);

  const modeText = mode === GameMode.MULTIPLICATION ? "nhân" : "chia";
  
  const prompt = `Bạn là một cô giáo tiểu học hiền hậu và yêu trẻ tên là "Cô Linh". 
  Học sinh vừa hoàn thành bài kiểm tra bảng ${modeText} ${selectedTable}.
  Kết quả: ${score}/${total}. 
  Hãy đưa ra một lời nhận xét ngắn gọn (dưới 50 từ), khích lệ, dùng các emoji đáng yêu. 
  Nếu điểm thấp, hãy động viên bé cố gắng hơn. Nếu điểm cao, hãy khen ngợi nhiệt tình. 
  LƯU Ý QUAN TRỌNG: Chỉ trả lời bằng văn bản thuần túy, KHÔNG sử dụng các ký tự định dạng như dấu sao (*), dấu thăng (#) hay gạch đầu dòng. Trả lời bằng tiếng Việt.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.95,
      },
    });
    return response.text?.replace(/[*#_~]/g, '') || getDefaultFeedback(score, total);
  } catch (error) {
    console.error("Gemini Error:", error);
    return getDefaultFeedback(score, total);
  }
};

const getDefaultFeedback = (score: number, total: number) => {
  if (score === total) return "Giỏi quá! Em đã hoàn thành xuất sắc bài học hôm nay! Chúc mừng em nhé. 🎉";
  if (score >= total * 0.8) return "Em làm rất tốt, chỉ sai một chút xíu thôi. Cố gắng lên nhé! 🌟";
  return "Em đã rất cố gắng rồi. Hãy ôn lại bài một chút và thử lại nhé, cô tin em sẽ làm được! 💪";
};

export const generateSpeech = async (text: string) => {
  const ai = getAIClient();
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Đọc giọng cô giáo hiền hậu, diễn cảm bằng tiếng Việt: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' }, 
          },
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};
