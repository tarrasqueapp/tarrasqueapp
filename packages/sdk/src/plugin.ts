// The properties that a Tarrasque plugin can have
interface TarrasquePluginProps {
  name: string;
  version: string;
  components?: {
    // The component that will be rendered when the user clicks on the plugin in the plugin list
    plugin?: JSX.Element | null;
    // The component that will be rendered in the dock of the map view
    dock?: JSX.Element | null;
  };
}

export class TarrasquePlugin implements TarrasquePluginProps {
  name = '';
  version = '0.0.0';
  components = {
    plugin: null,
    dock: null,
  };

  /**
   * Creates an instance of TarrasquePlugin.
   * @param config - The configuration for the plugin
   */
  constructor(config: TarrasquePluginProps) {
    Object.assign(this, config);
  }
}
