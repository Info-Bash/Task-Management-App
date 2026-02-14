import mongoose from "mongoose";

const dataBaseConnect = async () => {
  try {
    await mongoose.connect(process.env.DBASEURI);
    console.log('MongoDB is connected successully');
  } catch (e) {
    console.error('MongoDB connection Failed:', e);
    process.exit(1);
  }
}

export default dataBaseConnect;