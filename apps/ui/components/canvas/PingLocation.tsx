import { Graphics } from '@pixi/react';
import React, { useEffect, useState } from 'react';

import { PingLocationEntity, TarrasqueEvent, tarrasque } from '@tarrasque/sdk';

import { Color } from '../../lib/colors';

export default function PingLocation() {
  const [pings, setPings] = useState<PingLocationEntity[]>([]);

  // Pulse the red circle, smoothly growing and shrinking in size, forever, smoothly repeating
  const [size, setSize] = useState(0);
  const minSize = 0;
  const maxSize = 100;
  const speed = 0.05; // Adjust the speed of the transition

  useEffect(() => {
    tarrasque.on(TarrasqueEvent.PINGED_LOCATION, (ping) => {
      setPings((pings) => [...pings, ping]);
    });

    let frame = 0;

    const interval = setInterval(() => {
      // Use a sine wave to smoothly transition the size
      const newSize = minSize + ((maxSize - minSize) * (Math.sin(frame * speed) + 1)) / 2;
      setSize(newSize);
      frame++;
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
            g.lineStyle(5, Color.RED);
            g.drawCircle(0, 0, size);
          }}
          x={ping.coordinates.x}
          y={ping.coordinates.y}
        />
      ))}
    </>
  );
}
