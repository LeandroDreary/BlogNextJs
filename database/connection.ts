import mongoose, { Schema } from "mongoose"

const uri = process.env.DATABASE_STRING


export interface ConfigI {
  _id?: string;
  name?: string;
  content?: JSON
}

let ConfigSchema = new Schema({
  name: String,
  content: JSON
});

let ConfigModel = () => {
  try {
    return mongoose.model("config");
  } catch (error) {
    return mongoose.model("config", ConfigSchema);
  }
};

export const Config = ConfigModel();




export interface AuthI {
  _id?: string;
  user?: string;
  user_agent?: string;
  ip?: string;
}

let AuthSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "users" },
  user_agent: { type: String },
  ip: { type: String },
});

let AuthModel = () => {
  try {
    return mongoose.model("auth");
  } catch (error) {
    return mongoose.model("auth", AuthSchema);
  }
};

export const Auth = AuthModel();




export interface UserI {
  _id?: string;
  username?: string;
  discordUser?: string;
  activated?: boolean;
  password?: string;
}

let UserSchema = new Schema({
  username: { type: String, unique: true },
  discordUser: { type: String },
  activated: { type: Boolean },
  password: { type: String }
});

let UserModel = () => {
  try {
    return mongoose.model("users");
  } catch (error) {
    return mongoose.model("users", UserSchema);
  }
};

export const User = UserModel();



export interface CategoryI {
  _id?: string;
  name?: string;
  color?: string;
}

let CategorySchema = new Schema({
  name: { type: String, unique: true },
  color: String
});

let CategoryModel = () => {
  try {
    return mongoose.model("categories");
  } catch (error) {
    return mongoose.model("categories", CategorySchema);
  }
};

export const Category = CategoryModel();



export interface PostI {
  _id?: string;
  content?: string;
  title?: string;
  link?: string;
  author: { type: Schema.Types.ObjectId, ref: "users" },
  category?: { type: Schema.Types.ObjectId, ref: "categories" };
  description?: string;
  publishDate?: Date;
  image?: string;
}

let PostSchema = new Schema({
  title: String,
  link: { type: String, unique: true },
  content: { type: String },
  author: { type: Schema.Types.ObjectId, ref: "users" },
  category: { type: Schema.Types.ObjectId, ref: "categories" },
  description: { type: String },
  publishDate: { type: Date },
  image: { type: String }
});

export const PostModel = () => {
  try {
    return mongoose.model("posts");
  } catch (error) {
    return mongoose.model("posts", PostSchema);
  }
};

export const Post = PostModel();


const connection: any = {}

async function dbConnect() {
  /* check if we have connection to our databse*/
  if (connection?.isConnected) {
    console.log(connection?.isConnected)
    return
  }
  console.log(connection?.isConnected)
  /* connecting to our database */
  const db = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    maxPoolSize: 10,
    poolSize: 1, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    keepAlive: false
  })

  connection.isConnected = db.connections[0].readyState
}

export default dbConnect