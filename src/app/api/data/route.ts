// pages/api/data.ts
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return new Promise((resolve, reject) => {
    const filePath = path.resolve('.', 'public/data.csv');
    console.log('filePath:', filePath); // Debugging
    let data = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => data.push(row))
      .on('end', () => {
        resolve(
          NextResponse.json(data, {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          })
        );
      })
      .on('error', (err) => {
        console.error('Error reading CSV file:', err);
        reject(
          new Response(JSON.stringify({ error: 'Failed to read CSV file' }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
            },
          })
        );
      });
  });
}
