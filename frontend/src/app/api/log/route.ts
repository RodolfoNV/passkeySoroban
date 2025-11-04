import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Obtener información del request
    const headers = Object.fromEntries(request.headers.entries());
    const ip = (headers['x-forwarded-for'] || headers['x-real-ip'] || (request as any).ip || 'unknown') as string;
    const userAgent = headers['user-agent'] || '';

    const entry = {
      timestamp: new Date().toISOString(),
      ip,
      userAgent,
      ...body,
    };

    const logsDir = path.join(process.cwd(), 'frontend', 'logs');
    try {
      fs.mkdirSync(logsDir, { recursive: true });
      const file = path.join(logsDir, 'auth-events.log');
      fs.appendFileSync(file, JSON.stringify(entry) + '\n', { encoding: 'utf8' });
    } catch (e) {
      console.warn('Could not write log file', e);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
