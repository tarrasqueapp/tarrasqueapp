/**
 * @jest-environment jsdom
 */
import { expect, it } from '@jest/globals';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { useEffect, useState } from 'react';

import { TarrasquePlugin } from '../src/plugin';

global.setImmediate = jest.useRealTimers as unknown as typeof setImmediate;

it('initializes with basic config', () => {
  const plugin = new TarrasquePlugin({
    name: 'example-plugin',
    version: '1.0.0',
  });
  expect(plugin.name).toBe('example-plugin');
});

it('initializes with config and components', () => {
  const Plugin = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
      setMounted(true);
    }, []);
    return <div>{mounted ? 'Mounted' : 'Loading'}</div>;
  };

  const plugin = new TarrasquePlugin({
    name: 'example-plugin',
    version: '1.0.0',
    components: {
      plugin: <Plugin />,
    },
  });

  const component = render(plugin.components.plugin!);
  expect(component).toMatchSnapshot();
});
