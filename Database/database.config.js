import mongoose from "mongoose";

export async function connections() {
  // THE connection is a function that is called when the connection of the server with the connection of Database is established
  try {
    const connect = await mongoose.connect(process.env.DATABASE_URL);
  } catch (err) {
    console.log(err);
  }
}

export default connections;
