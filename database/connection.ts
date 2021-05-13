import mongoose, { Schema } from "mongoose"

const uri = process.env.DATABASE_STRING


export interface ConfigI {
  name?: String;
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
  user?: String;
  user_agent?: String;
  ip?: String;
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
  username?: String;
  email?: String;
  password?: String;
}

let UserSchema = new Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
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
  name?: String;
  color?: String;
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
  content?: String;
  title?: String;
  link?: String;
  category?: { type: Schema.Types.ObjectId, ref: "categories" };
  description?: String;
  publishDate?: Date;
  image?: String;
}

let PostSchema = new Schema({
  title: String,
  link: { type: String, unique: true },
  content: String,
  category: { type: Schema.Types.ObjectId, ref: "categories" },
  description: String,
  publishDate: Date,
  image: String
});

export const PostModel = () => {
  try {
    return mongoose.model("posts");
  } catch (error) {
    return mongoose.model("posts", PostSchema);
  }
};

export const Post = PostModel();




const dbConnect = async () => {
  let state = mongoose.connection.readyState;
  if (state === 0 || state === 3) {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};

export default dbConnect;