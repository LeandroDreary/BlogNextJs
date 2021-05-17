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




const dbConnect = async () => {
  let state = mongoose.connection.readyState;
  console.log(state)
  if (state === 0 || state === 3) {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};

export default dbConnect;