import mongoose from "mongoose";
import colors from "colors";

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.DATABASE_URL) // conexion
    const url = `${connection.connection.host}: ${connection.connection.port}`
    console.log(colors.magenta.bold(`MongoDB Connected: ${url}`));

  } catch (error) {
  //En caso de error
    console.log(colors.red.bold(`Error al conectar MongoDB: ${error.message}`));
    process.exit(1); // Exit with failure
  }
};