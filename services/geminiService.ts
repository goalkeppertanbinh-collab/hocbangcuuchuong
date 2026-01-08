
import { GoogleGenAI, Modality } from "@google/genai";
import { GameMode, ProgressData } from "../types";

export const getAiFeedback = async (score: number, total: number, selectedTable: number, mode: GameMode) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
    return response.text?.replace(/[*#_~]/g, '') || "";
  } catch (error) {
    console.error("Gemini Error:", error);
    return score === total ? "Giỏi quá! Em đã hoàn thành xuất sắc bài học hôm nay! Chúc mừng em nhé." : "Cố gắng lên nào, cô tin là lần sau em sẽ làm tốt hơn đấy!";
  }
};

export const getImprovementSuggestions = async (progress: ProgressData) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const learnedCount = progress.multiplication.length + progress.division.length;
  const bestScores = progress.quizHistory.map(h => `${h.mode === GameMode.MULTIPLICATION ? 'Nhân' : 'Chia'} ${h.table}: ${h.bestScore}/10`).join(', ');
  
  const prompt = `Bạn là Cô Linh, cô giáo dạy toán tiểu học. Dựa trên thông tin học tập của bé:
  - Tổng số bảng đã học xong: ${learnedCount}/16
  - Kết quả tốt nhất ở các bảng đã làm bài: ${bestScores || 'Chưa làm bài nào'}
  Hãy đưa ra 3 lời khuyên ngắn gọn cho bé (ví dụ: cần luyện thêm bảng nào, khen ngợi bảng nào giỏi). 
  Dùng ngôn ngữ thân thiện, có emoji. KHÔNG dùng định dạng Markdown (*, #). Trả lời tiếng Việt.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text?.replace(/[*#_~]/g, '') || "Em hãy tiếp tục cố gắng luyện tập mỗi ngày nhé!";
  } catch (error) {
    return "Em hãy học thêm các bảng mới và ôn tập lại những bảng chưa đạt điểm cao nhé!";
  }
};

export const generateSpeech = async (text: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};
