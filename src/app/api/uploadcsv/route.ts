// pages/api/uploadcsv.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import formidable from 'formidable';
import fs from 'fs-extra'; // For reading the file
import { verifyToken } from '../../utils/jwt'; // Adjust the path as necessary
import { connectToDatabase } from '../../utils/mongodb'; // Adjust the path as necessary

export const config = {
  api: {
    bodyParser: false, // Disable the default bodyParser
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify JWT
  const verifiedToken = verifyToken(req);
  if (!verifiedToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = new ObjectId((verifiedToken as any).userId);
  const { db } = await connectToDatabase();

  // Find the user by ID to ensure they exist
  const user = await db.collection('users').findOne({ _id: userId });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing the form data:', err);
      return res.status(500).json({ error: 'Error parsing form data' });
    }

    const csvFile = files.csvfile;
    if (!csvFile) {
      return res.status(400).json({ error: 'No CSV file uploaded' });
    }

    // Read the CSV file content
    const csvContent = await fs.readFile(csvFile.filepath, 'utf8');

    // Here you could process the CSV content as needed before saving
    // For this example, let's save the CSV content directly in the user's document

    await db.collection('users').updateOne(
      { _id: userId },
      { $set: { csvContent: csvContent } } // Saving the CSV content in a new field
    );

    // Cleanup the uploaded file
    await fs.remove(csvFile.filepath);

    return res.status(200).json({ message: 'CSV file uploaded and saved successfully' });
  });
}
