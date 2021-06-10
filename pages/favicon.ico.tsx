import React from "react";
import { Config } from '../database/models'
import DbConnect from '../utils/dbConnect'

export async function getServerSideProps({ res }) {
  await DbConnect()
  let iconIco = null
  try {
    iconIco = await Config.findOne({ name: "IconIco" }).select(`-_id`).exec()
    iconIco = iconIco._doc.content
  } catch (e) { }
  
  const imageResp = Buffer.from(iconIco?.iconICO, "base64");

  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': imageResp.length
  });
  res.end(imageResp);

  return { props: {} };
}

const Sitemap: React.FC = () => (<></>)

export default Sitemap;