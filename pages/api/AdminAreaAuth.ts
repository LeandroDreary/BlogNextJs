import { NextApiRequest, NextApiResponse } from 'next'
import Cookies from 'cookies'
import bcrypt from 'bcryptjs'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = new Cookies(req, res)

  switch (req.method) {
    case "DELETE":
      cookies.set('AdminAreaAuth')
      break;
  }

  bcrypt.compareSync(`${process.env.ADMINPASSWORD}_${process.env.ADMINUSERNAME}`, (cookies.get('AdminAreaAuth') || "")) ?
    res.status(200).json({ username: process.env.ADMINUSERNAME }) :
    res.status(200).json({})

}

export default handler