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
    const conn = new Connection('127.0.0.1', 8021, 'ClueCon');
    
    conn.on('error', (err) => {
      console.error('ESL Connection Error:', err);
      res.status(500).json({
        success: false,
        message: 'Failed to connect to FreeSWITCH',
        error: err.message
      });
    });

    conn.on('esl::ready', async () => {
      try {
        // Get all registered extensions using show registrations command
        const result = await new Promise<string>((resolve, reject) => {
          (conn as any).api('sofia status profile internal reg', (response: any) => {
            if (!response) reject(new Error('No response from FreeSWITCH'));
            else resolve(response.getBody());
          });
        });

        // Parse the registration data from sofia status
        const registrations = result
          .split('\n')
          .filter(line => line.trim().length > 0)
          .filter(line => line.includes('Auth-User'))
          .map(line => line.replace('Auth-User:', " ").trim());

        res.status(200).json({
          success: true,
          data: registrations
        });
      } catch (error) {
        console.error('❌ ESL command error:', error instanceof Error ? error.message : 'Unknown error');
        res.status(500).json({
          success: false,
          message: 'Failed to get registrations',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      } finally {
        conn.disconnect();
      }
    });

    // Connect to FreeSWITCH
    conn.connected();
  } catch (error) {
    console.error('❌ ESL error:', error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({
      success: false,
      message: 'Failed to initialize ESL connection',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function checkExtensionNumberIsRegistered(req: Request, res: Response): Promise<void> {
  const { extension } = req.params;
  console.log(extension)

  if (!extension) {
    res.status(400).json({
      success: false,
      message: 'Extension number is required'
    });
  }

  try {
    const conn = new Connection('127.0.0.1', 8021, 'ClueCon');
    
    conn.on('error', (err) => {
      console.error('ESL Connection Error:', err);
      res.status(500).json({
        success: false,
        message: 'Failed to connect to FreeSWITCH',
        error: err.message
      });
    });

    conn.on('esl::ready', async () => {
      try {
        // Get all registered extensions using show registrations command
        const result = await new Promise<string>((resolve, reject) => {
          (conn as any).api('sofia status profile internal reg', (response: any) => {
            if (!response) reject(new Error('No response from FreeSWITCH'));
            else resolve(response.getBody());
          });
        });

        // Parse the registration data from sofia status
        const registrations = result
          .split('\n')
          .filter(line => line.trim().length > 0)
          .filter(line => line.includes('Auth-User'))
          .map(line => line.replace('Auth-User:', " ").trim());

        res.status(200).json({
          success: true,
          data: registrations.includes(extension) ? "1" : '0'
        });
      } catch (error) {
        console.error('❌ ESL command error:', error instanceof Error ? error.message : 'Unknown error');
        res.status(500).json({
          success: false,
          message: 'Failed to get registrations',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      } finally {
        conn.disconnect();
      }
    });

    // Connect to FreeSWITCH
    conn.connected();
  } catch (error) {
    console.error('❌ ESL error:', error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({
      success: false,
      message: 'Failed to initialize ESL connection',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
export { getAllExtensionNumbers, getAllRegisteredExtensionNumbers, checkExtensionNumberIsRegistered };