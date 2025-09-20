import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// 로컬 파일 스토리지 (S3 대체)
export class LocalFileStorage {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'uploads');
    this.ensureUploadDir();
  }

  private ensureUploadDir() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }

    // 사용자별 폴더 구조 생성
    const folders = ['avatars', 'posts', 'activities'];
    folders.forEach(folder => {
      const folderPath = path.join(this.uploadDir, folder);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
    });
  }

  // 업로드 URL 생성 (S3 presigned URL 대체)
  generateUploadUrl(target: 'avatar' | 'post' | 'activity', userId: string, fileName?: string): string {
    const extension = fileName ? path.extname(fileName) : '.jpg';
    const uniqueFileName = `${uuidv4()}${extension}`;
    
    let subDir = '';
    switch (target) {
      case 'avatar':
        subDir = 'avatars';
        break;
      case 'post':
        subDir = 'posts';
        break;
      case 'activity':
        subDir = 'activities';
        break;
    }

    const filePath = path.join(subDir, `${userId}_${uniqueFileName}`);
    return filePath;
  }

  // 파일 저장
  async saveFile(key: string, buffer: Buffer): Promise<string> {
    const filePath = path.join(this.uploadDir, key);
    const dir = path.dirname(filePath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, buffer);
    return key;
  }

  // 파일 URL 생성 (로컬 서버 URL)
  getFileUrl(key: string): string {
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    return `${baseUrl}/uploads/${key}`;
  }

  // 파일 삭제
  async deleteFile(key: string): Promise<boolean> {
    try {
      const filePath = path.join(this.uploadDir, key);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  // 파일 존재 확인
  fileExists(key: string): boolean {
    const filePath = path.join(this.uploadDir, key);
    return fs.existsSync(filePath);
  }
}

export const localStorage = new LocalFileStorage();
