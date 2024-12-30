import { initCloudwatch, logToCloudWatch } from "@/util/cloudwatch";
import { NextApiRequest, NextApiResponse } from "next";

initCloudwatch();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { message } = req.body;
            if (!message) {
                return res.status(400).json({ error: 'No message provided' });
            }

            await logToCloudWatch(message);
            return res.status(200).json({ message: 'Success' });
        } catch (error: any) {
            console.error(error);
            await logToCloudWatch(`Error occurred: ${error.message}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}