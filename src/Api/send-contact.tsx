import axios from "axios";

interface IData {
    name: string,
    email: string,
    subject: string,
    message: string,
    phone: string
}

const sendContact = async (data: IData) => {
  try {
    await axios.post(
      `${process.env.BACKEND}/contact-us`,
      {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        phone: data.phone,
      }
    );
    return true;
  } catch (error: any) {
    console.error(error)
    return false
  }
};

export default sendContact;
