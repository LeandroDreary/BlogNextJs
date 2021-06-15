import mongoose, { Schema } from "mongoose"

export interface ConfigI {
  _id?: Schema.Types.ObjectId;
  name?: string;
  content?: JSON
}

let ConfigSchema = new Schema({
  name: String,
  content: JSON
});

export let ConfigModel = () => {
  try {
    return mongoose.model("config");
  } catch (error) {
    return mongoose.model("config", ConfigSchema);
  }
};

export const Config: mongoose.Model<ConfigI, {}, {}> = ConfigModel();




export interface AuthI {
  _id?: Schema.Types.ObjectId;
  user?: Schema.Types.ObjectId;
  user_agent?: string;
  ip?: string;
}

let AuthSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "users" },
  user_agent: { type: String },
  ip: { type: String },
});

export let AuthModel = () => {
  try {
    return mongoose.model("auth");
  } catch (error) {
    return mongoose.model("auth", AuthSchema);
  }
};

export const Auth: mongoose.Model<AuthI, {}, {}> = AuthModel();




export interface UserI {
  _id?: Schema.Types.ObjectId;
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

export let UserModel = () => {
  try {
    return mongoose.model("users");
  } catch (error) {
    return mongoose.model("users", UserSchema);
  }
};

export const User: mongoose.Model<UserI, {}, {}> = UserModel();



export interface CategoryI {
  _id?: Schema.Types.ObjectId;
  name?: string;
  color?: string;
  link?: string;
}

let CategorySchema = new Schema({
  name: { type: String },
  color: { type: String },
  link: { type: String, unique: true }
});

export let CategoryModel = () => {
  try {
    return mongoose.model("categories");
  } catch (error) {
    return mongoose.model("categories", CategorySchema);
  }
};

export const Category: mongoose.Model<CategoryI, {}, {}> = CategoryModel();



export interface PostI {
  _id?: Schema.Types.ObjectId;
  content?: string;
  title?: string;
  link?: string;
  author?: Schema.Types.ObjectId;
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

export const Post: mongoose.Model<PostI, {}, {}> = PostModel();