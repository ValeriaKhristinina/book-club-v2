import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Cron check");
  console.log("res", res);
  res.status(200).end("Hello Cron!");
}
