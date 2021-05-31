import React from "react";
import { Config } from '../database/models'
import DbConnect from '../utils/dbConnect'

export async function getServerSideProps({ res }) {
  await DbConnect()
  let info = null
  try {
    info = await Config.findOne({ name: "info" }).select(`-_id`).exec()
    info = info._doc.content
  } catch (e) { }
  
  const imageResp = new Buffer(info?.iconICO, "base64");

  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': imageResp.length
  });
  res.end(imageResp);

  return { props: {} };
}

const Sitemap: React.FC = () => (<></>)

export default Sitemap;