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
  image?: string;
  discordUser?: string;
  activated?: boolean;
  password?: string;
  link?: string;
}

let UserSchema = new Schema({
  username: { type: String, unique: true },
  discordUser: { type: String },
  image: { type: String },
  activated: { type: Boolean },
  password: { type: String },
  link: { type: String, unique: true }
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
  link?: string;
}

let CategorySchema = new Schema({
  name: { type: String },
  color: { type: String },
  link: { type: String, unique: true }
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
  author: Schema.Types.ObjectId;
  category?: Schema.Types.ObjectId;
  description?: string;
  publishDate?: Date;
  image?: string;
  counter?: number;
}

let PostSchema = new Schema({
  title: { type: String },
  content: { type: String },
  link: { type: String, unique: true },
  author: { type: Schema.Types.ObjectId, ref: "users" },
  category: { type: Schema.Types.ObjectId, ref: "categories" },
  description: { type: String },
  publishDate: { type: Date },
  image: { type: String },
  counter: { type: Number }
});

export const PostModel = () => {
  try {
    return mongoose.model("posts");
  } catch (error) {
    return mongoose.model("posts", PostSchema);
  }
};

export const Post = PostModel();