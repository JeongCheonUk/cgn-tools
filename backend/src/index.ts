import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

export interface Env {
  AWS_ACCESS_KEY_ID: string
  AWS_SECRET_ACCESS_KEY: string
  AWS_REGION: string
  S3_BUCKET_NAME: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    if (url.pathname === '/api/upload' && request.method === 'POST') {
      return handleUpload(request, env, corsHeaders)
    }

    if (url.pathname === '/health') {
      return Response.json({ status: 'ok' }, { headers: corsHeaders })
    }

    return new Response('Not Found', { status: 404 })
  },
}

async function handleUpload(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>
): Promise<Response> {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File | null
    const filename = formData.get('filename') as string | null

    if (!file) {
      return Response.json({ error: '파일이 없습니다.' }, { status: 400, headers: corsHeaders })
    }
    if (!filename) {
      return Response.json({ error: '파일명이 필요합니다.' }, { status: 400, headers: corsHeaders })
    }
    if (file.type !== 'image/png') {
      return Response.json({ error: 'PNG 파일만 업로드 가능합니다.' }, { status: 400, headers: corsHeaders })
    }

    const finalFilename = filename.endsWith('.png') ? filename : `${filename}.png`
    const s3Key = `thumb/${finalFilename}`

    const s3 = new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    })

    const buffer = await file.arrayBuffer()

    await s3.send(new PutObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: s3Key,
      Body: new Uint8Array(buffer),
      ContentType: 'image/png',
    }))

    return Response.json(
      { success: true, message: '업로드 성공', filename: finalFilename, path: s3Key },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error('Upload error:', error)
    return Response.json(
      { error: '업로드 실패', message: String(error) },
      { status: 500, headers: corsHeaders }
    )
  }
}
