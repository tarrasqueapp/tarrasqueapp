import { Graphics } from '@pixi/react';
import React, { useEffect, useState } from 'react';

import { PingLocationEntity } from '@/lib/types';
import { createBrowserClient } from '@/utils/supabase/client';

export function PingLocation() {
  const [pings, setPings] = useState<(PingLocationEntity & { size: number; frame: number })[]>([]);

  useEffect(() => {
    const supabase = createBrowserClient();

    supabase.channel('').subscribe((payload) => {});

    // socket.on(SocketEvent.PINGED_LOCATION, (ping) => {
    //   const pingWithAnimation = {
    //     ...ping,
    //     frame: 0,
    //     size: 0,
    //     timestamp: Date.now(),
    //   };
    //   setPings((currentPings) => [...currentPings, pingWithAnimation]);

    //   // Set timeout to remove the ping after 1.5 seconds
    //   setTimeout(() => {
    //     setPings((currentPings) => currentPings.filter((p) => p.id !== pingWithAnimation.id));
    //   }, 1750);
    // });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPings((currentPings) =>
        currentPings.map((ping) => {
          const minSize = 0;
          const maxSize = 100;
          const speed = 0.15;
          const newSize = minSize + ((maxSize - minSize) * (Math.sin(ping.frame * speed) + 1)) / 2;
          return { ...ping, size: newSize, frame: ping.frame + 1 };
        }),
      );
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {pings.map((ping, index) => (
        <Graphics
          key={index}
          draw={(g) => {
            g.clear();
            g.lineStyle(5, ping.color, 0.5);
            g.beginFill(ping.color, 0.5); // Begin the fill process
            g.drawCircle(0, 0, ping.size); // Draw the circle
            g.endFill(); // Complete the fill process
          }}
          x={ping.coordinates.x}
          y={ping.coordinates.y}
        />
      ))}
    </>
  );
}
