import { Request, Response } from 'express';
import { Pool } from 'pg';
import { Connection } from 'modesl';

interface Extension {
  extension: string;
}

interface RegisteredExtension {
  extension: string;
  contact: string;
  status: string;
}

async function getAllExtensionNumbers(req: Request, res: Response): Promise<void> {
  const pool = new Pool({
    host: '127.0.0.1',
    port: 5432,
    user: 'fusionpbx',
    password: '4R7s2lEftFuQEd6jcO45FMapk',
    database: 'fusionpbx',
  });

  try {
    const result = await pool.query<any>('SELECT extension FROM v_extensions ORDER BY extension');
    const extensions = result.rows.map((row: any) => row.extension);

    res.status(200).json({
        success: true,
        data: extensions
    });
  } catch (error) {
    console.error('❌ Query error:', error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    await pool.end();
  }
}

async function getAllRegisteredExtensionNumbers(req: Request, res: Response): Promise<void> {
  try {
    const conn = new Connection('64.23.231.206', 8021, 'ClueCon');

    conn.on('error', (err) => {
      console.error('❌ ESL Connection Error:', err);
      res.status(500).json({
        success: false,
        message: 'Failed to connect to FreeSWITCH',
        error: err.message,
      });
    });

    conn.on('esl::ready', () => {
      console.log("✅ Connected to FreeSWITCH!");

      (conn as any).api('sofia xmlstatus profile internal reg', (response: any) => {
        const xml = response.getBody();

        if (!xml || !xml.includes('<registrations>')) {
          res.status(200).json({
            success: true,
            data: [],
            message: 'No registrations found.',
          });
          conn.disconnect();
          return;
        }

        // Parse the XML response
        const parser = require('fast-xml-parser');
        const parsed = parser.parse(xml);
        const regs = parsed?.profile?.registrations?.registration;

        let extensions: string[] = [];

        if (Array.isArray(regs)) {
          extensions = regs.map((r: any) => r.user);
        } else if (regs?.user) {
          extensions = [regs.user];
        }

        res.status(200).json({
          success: true,
          data: extensions,
        });

        conn.disconnect();
      });
    });

    conn.connected();
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    res.status(500).json({
      success: false,
      message: 'Unhandled ESL error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export { getAllExtensionNumbers, getAllRegisteredExtensionNumbers };