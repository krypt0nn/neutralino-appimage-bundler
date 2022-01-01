import * as fs from 'fs';
import { https } from 'follow-redirects';

export default abstract class InstallTool
{
    public static readonly uri: string;
    public static readonly file: string;

    public static installed(): Promise<boolean>
    {
        return new Promise((resolve) => resolve(fs.existsSync(this.file)));
    }

    public static install(): Promise<void>
    {
        return new Promise((resolve) => {
            https.get(this.uri, (res) => {
                const stream = fs.createWriteStream(this.file);
    
                res.pipe(stream);
    
                stream.on('finish', () => {
                    stream.close();

                    fs.chmodSync(this.file, 0o755);
    
                    resolve();
                });
            });
        });
    }
};
