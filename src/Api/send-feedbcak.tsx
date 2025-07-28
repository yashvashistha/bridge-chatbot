import axios from "axios";

const sendFeedback = async (rating: number, feedback_text: string, session_id: string | null) => {
  try {
    await axios.post(
      `${process.env.BACKEND}/submit-feedback`,
      {
        rating,
        feedback_text,
        session_id,
        timestamp: new Date()
      }
    );
    return true;
  } catch (error: any) {
    console.error(error)
    return false
  }
};

export default sendFeedback;
