import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

// api/images 
export default async function imageHandle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const method: String = req.method;
    const saveFile = async (file, folderName) => {
      const data = fs.readFileSync(file.filepath);
      fs.writeFileSync(`./public/images/${folderName}/${file.originalFilename}`, data);
      fs.unlinkSync(file.filepath);
      return;
    };
    
    switch (method) {
      case 'POST':
        const form = new formidable.IncomingForm();
        form.parse(req, async function (err, fields, files) {
          await saveFile(files.file, fields.folderName);
        });
        res.status(200).json({ succes: 'true' });
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } catch (error) {
    console.log(error);
  }
}
