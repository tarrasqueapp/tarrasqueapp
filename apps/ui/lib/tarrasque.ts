class Tarrasque {
  constructor() {}

  get iframes(): NodeListOf<HTMLIFrameElement> {
    return document.querySelectorAll('iframe');
  }

  emit<T>(event: string, data: T) {
    this.iframes.forEach((iframe) => {
      iframe.contentWindow?.postMessage({ event, data }, '*');
    });
  }
}

export const tarrasque = new Tarrasque();
