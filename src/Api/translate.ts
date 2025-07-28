import axios from "axios";

const translateText = async (
  text: string,
  textDirection: "en-to-ar" | "ar-to-en" | null
) => {
  try {
    const response = await axios.post(
      `${process.env.BACKEND}/translate`,
      { text, direction: textDirection }
    );
    return response.data.translated_text;
  } catch (error: any) {
    if (error.response) {
      console.error("API Error Response:", error.response.data.detail);
    }
    console.error("Error translating text:", error.message);
    throw error;
  }
};

export default translateText;
