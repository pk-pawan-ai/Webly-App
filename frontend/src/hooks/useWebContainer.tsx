// import { WebContainer } from '@webcontainer/api';
// import { useEffect, useState } from 'react';


// // Create a singleton instance
// let webcontainerInstance: WebContainer | null = null;
// let bootPromise: Promise<WebContainer> | null = null;

// export function useWebContainer() {
  //   const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null);
  
  //   useEffect(() => {
    //     async function bootWebContainer() {
      //       try {
        //         // If we already have an instance, use it
        //         if (webcontainerInstance) {
          //           setWebcontainer(webcontainerInstance);
          //           return;
          //         }
          
          //         // If a boot is in progress, wait for it
          //         if (!bootPromise) {
            //           bootPromise = WebContainer.boot();
            //         }
            
            //         webcontainerInstance = await bootPromise;
            //         setWebcontainer(webcontainerInstance);
            //         console.log('WebContainer booted successfully');
            //       } catch (error) {
              //         console.error('Failed to boot WebContainer:', error);
              //         // Reset on error
              //         webcontainerInstance = null;
              //         bootPromise = null;
              //       }
              //     }
              
              //     bootWebContainer();
              //   }, []);
              
              //   return webcontainer;
              // }
              
              
import { WebContainer } from "@webcontainer/api";
import { useEffect, useState } from "react";

export function useWebContainer() {
  const [webcontainer,setWebcontainer] = useState<WebContainer>();

  async function main() {
    const webcontainerInstance = await WebContainer.boot();
    setWebcontainer(webcontainerInstance);
  }
  useEffect(() => {
    main()
  },[])

  return webcontainer;
};