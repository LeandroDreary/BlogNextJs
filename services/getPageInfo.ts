import { Config } from "../database/models";

async function getPageInfo() {
  let info = null;
  try {
    info = await Config.findOne({ name: "info" }).select(`-_id`).exec();
    info = info._doc.content;
  } catch (e) {}
  return info;
}

export { getPageInfo };
