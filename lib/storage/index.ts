import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_DOC_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOC_TYPES]
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export interface UploadResult {
  url: string
  filename: string
  size: number
  mimeType: string
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: `File type not allowed: ${file.type}` }
  }
  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'File too large. Maximum 10MB.' }
  }
  return { valid: true }
}

async function uploadLocal(file: File, folder: string): Promise<UploadResult> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Validate magic bytes (basic MIME sniffing)
  const ext = getExtFromMime(file.type)
  if (!ext) throw new Error('Invalid file type')

  const filename = `${crypto.randomUUID()}.${ext}`
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder)

  await mkdir(uploadDir, { recursive: true })
  await writeFile(path.join(uploadDir, filename), buffer)

  return {
    url: `/uploads/${folder}/${filename}`,
    filename,
    size: file.size,
    mimeType: file.type,
  }
}

async function uploadS3(file: File, folder: string): Promise<UploadResult> {
  // Requires AWS SDK — add `@aws-sdk/client-s3` to package.json when enabling
  throw new Error('S3 upload not configured. Set STORAGE_PROVIDER=local for development.')
}

export async function uploadFile(file: File, folder = 'media'): Promise<UploadResult> {
  const provider = process.env.STORAGE_PROVIDER || 'local'

  const validation = validateFile(file)
  if (!validation.valid) throw new Error(validation.error)

  if (provider === 's3') return uploadS3(file, folder)
  return uploadLocal(file, folder)
}

function getExtFromMime(mime: string): string | null {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'application/pdf': 'pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  }
  return map[mime] ?? null
}
