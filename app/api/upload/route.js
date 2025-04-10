import { NextResponse } from 'next/server';
import { IncomingForm } from 'formidable';
import { Readable } from 'stream';
import fs from 'fs';
import OpenAI from 'openai';
import pdfParse from 'pdf-parse';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  const contentType = req.headers.get('content-type') || '';
  if (!contentType.includes('multipart/form-data')) {
    return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 });
  }

  const form = new IncomingForm();

  const reqBody = await req.body;
  const stream = Readable.fromWeb(reqBody);

  const fakeReq = Object.assign(stream, {
    headers: {
      'content-type': contentType,
      'content-length': req.headers.get('content-length') || '0',
    },
    method: 'POST',
    url: '',
  });

  return new Promise((resolve, reject) => {
    form.parse(fakeReq, async (err, fields, files) => {
      if (err) {
        console.error(err);
        return reject(NextResponse.json({ error: 'File parsing failed' }, { status: 500 }));
      }

      try {
        const uploadedFile = files.file?.[0] || files.file;
        if (!uploadedFile || !uploadedFile.filepath) {
          return reject(NextResponse.json({ error: 'Filepath missing or upload failed' }, { status: 400 }));
        }
        
        const dataBuffer = fs.readFileSync(uploadedFile.filepath);
        const pdfData = await pdfParse(dataBuffer);

        const prompt =
          fields.docType === 'psa'
            ? `You are a real estate assistant. Analyze the following Purchase and Sale Agreement and extract:
- Buyer and seller names
- Property address
- Closing date
- Earnest money amount
- Contingencies and their deadlines
- Any red flags or missing info
Return the results in JSON format.`
            : `You are a real estate assistant. Analyze the following Title Report and extract:
- Property legal description
- Recorded owner
- Easements or encumbrances
- Exceptions to title insurance
- Required documents or actions before closing
Return the results in JSON format.`;

        // Estimate a safe max token size for gpt-4o (words ~ tokens)
        const gpt4oText = pdfData.text.split(' ').slice(0, 90000).join(' ');

        try {
          const gptResponse = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
              { role: 'system', content: prompt },
              { role: 'user', content: gpt4oText },
            ],
          });

          return resolve(
            NextResponse.json({ gptOutput: gptResponse.choices[0].message.content })
          );
        } catch (error) {
          console.warn('GPT-4o failed, attempting fallback to gpt-3.5-turbo...');

          try {
            // Slice text even smaller for gpt-3.5-turbo
            const gpt3Text = pdfData.text.split(' ').slice(0, 10000).join(' ');

            const fallbackResponse = await openai.chat.completions.create({
              model: 'gpt-3.5-turbo',
              messages: [
                { role: 'system', content: prompt },
                { role: 'user', content: gpt3Text },
              ],
            });

            return resolve(
              NextResponse.json({ gptOutput: fallbackResponse.choices[0].message.content })
            );
          } catch (fallbackError) {
            console.error('OpenAI Fallback Error:', fallbackError);
            return reject(
              NextResponse.json(
                {
                  error:
                    fallbackError?.response?.data?.error?.message ||
                    fallbackError.message ||
                    'OpenAI failed to generate a response.',
                },
                { status: 500 }
              )
            );
          }
        }
      } catch (error) {
        console.error('Error during processing:', error);
        reject(NextResponse.json({ error: 'Failed to process PDF or generate GPT response' }, { status: 500 }));
      }
    });
  });
}
