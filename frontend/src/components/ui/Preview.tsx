import { WebContainer } from '@webcontainer/api';
import { useEffect, useState } from 'react';

interface PreviewFrameProps {
  files: any[];
  webContainer: WebContainer;
}

export const PreviewFrame = ({files, webContainer} : PreviewFrameProps) => {
  const [url, setUrl] = useState<string>('');

  async function main() {
    try {
      // Add server-ready listener first
      webContainer.on('server-ready', (port, url) => {
        console.log('Server ready on port:', port);
        console.log('Server URL:', url);
        setUrl(url);
      });

      // Install dependencies
      console.log('Installing dependencies...');
      const installProcess = await webContainer.spawn('npm', ['install']);

      installProcess.output.pipeTo(new WritableStream({
        write(data) {
          console.log('Install process:', data);
        }
      }));

      const installExitCode = await installProcess.exit;
      if (installExitCode !== 0) {
        throw new Error('npm install failed');
      }

      // Start dev server
      console.log('Starting dev server...');
      const devProcess = await webContainer.spawn('npm', ['run', 'dev']);
      
      // Listen to dev server output
      devProcess.output.pipeTo(new WritableStream({
        write(data) {
          console.log('Dev server:', data);
          // Look for the local URL in the output
          if (data.includes('Local:')) {
            const match = data.match(/http:\/\/localhost:\d+/);
            if (match) {
              console.log('Found server URL:', match[0]);
              setUrl(match[0]);
            }
          }
        }
      }));

    } catch (error) {
      console.error('Error in preview:', error);
    }
  }

  useEffect(() => {
    main();
  }, []);

  return (
    <div className="w-full h-[90vh] bg-white flex items-center justify-center">
      {url ? (
        <iframe 
          src={url}
          className="w-full h-full border-none"
          title="Preview"
        />
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Preview Mode</h2>
          <p className="text-gray-500">Setting up preview environment...</p>
        </div>
      )}
    </div>
  );
};