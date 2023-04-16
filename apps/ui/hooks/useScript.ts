import { useEffect, useState } from 'react';

export enum ScriptStatus {
  Idle = 'idle',
  Loading = 'loading',
  Ready = 'ready',
  Error = 'error',
}

export function useScript(src: string) {
  // Keep track of script status ("idle", "loading", "ready", "error")
  const [status, setStatus] = useState<ScriptStatus>(src ? ScriptStatus.Loading : ScriptStatus.Idle);

  useEffect(
    () => {
      // Allow falsy src value if waiting on other data needed for
      // constructing the script URL passed to this hook.
      if (!src) {
        setStatus(ScriptStatus.Idle);
        return;
      }

      // Fetch existing script element by src
      // It may have been added by another intance of this hook
      let script = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement;

      if (!script) {
        // Create script
        script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.type = 'module';
        script.setAttribute('data-status', ScriptStatus.Loading);
        // Add script to document body
        document.body.appendChild(script);

        // Store status in attribute on script
        // This can be read by other instances of this hook
        const setAttributeFromEvent = (event: Event) => {
          script.setAttribute('data-status', event.type === 'load' ? ScriptStatus.Ready : ScriptStatus.Error);
        };

        script.addEventListener('load', setAttributeFromEvent);
        script.addEventListener('error', setAttributeFromEvent);
      } else {
        // Grab existing script status from attribute and set to state.
        setStatus(script.getAttribute('data-status') as ScriptStatus);
      }

      // Script event handler to update status in state
      // Note: Even if the script already exists we still need to add
      // event handlers to update the state for *this* hook instance.
      const setStateFromEvent = (event: Event) => {
        setStatus(event.type === 'load' ? ScriptStatus.Ready : ScriptStatus.Error);
      };

      // Add event listeners
      script.addEventListener('load', setStateFromEvent);
      script.addEventListener('error', setStateFromEvent);

      // Remove event listeners on cleanup
      return () => {
        if (script) {
          script.removeEventListener('load', setStateFromEvent);
          script.removeEventListener('error', setStateFromEvent);
        }
      };
    },
    [src], // Only re-run effect if script src changes
  );

  return status;
}
