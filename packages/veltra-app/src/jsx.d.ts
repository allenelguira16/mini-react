// export {};

import {
  DataHTMLAttributes,
  DelHTMLAttributes,
  HTMLAnchorAttributes,
  HTMLAttributes,
  HTMLAudioAttributes,
  HTMLButtonAttributes,
  HTMLDetailsAttributes,
  HTMLEmbedAttributes,
  HTMLFieldsetAttributes,
  HTMLFormAttributes,
  HTMLIframeAttributes,
  HTMLImgAttributes,
  HTMLInputAttributes,
  HTMLLabelAttributes,
  HTMLLegendAttributes,
  HTMLLinkAttributes,
  HTMLMetaAttributes,
  HTMLMeterAttributes,
  HTMLObjectAttributes,
  HTMLOptgroupAttributes,
  HTMLOptionAttributes,
  HTMLOutputAttributes,
  HTMLParamAttributes,
  HTMLProgressAttributes,
  HTMLScriptAttributes,
  HTMLSelectAttributes,
  HTMLSummaryAttributes,
  HTMLTableAttributes,
  HTMLTextAreaAttributes,
  HTMLVideoAttributes,
  HTMLVoidAttributes,
  InsHTMLAttributes,
  SourceHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
  TimeHTMLAttributes,
  TrackHTMLAttributes,
} from "./types";

declare global {
  namespace JSX {
    type Element = false | undefined | null | string | number | Node | Element[] | (() => Element);

    interface IntrinsicElements {
      a: HTMLAnchorAttributes<HTMLAnchorElement>;
      abbr: HTMLAttributes<HTMLElement>;
      address: HTMLAttributes<HTMLElement>;
      area: HTMLVoidAttributes<HTMLAreaElement>;
      article: HTMLAttributes<HTMLElement>;
      aside: HTMLAttributes<HTMLElement>;
      audio: HTMLAudioAttributes<HTMLAudioElement>;
      b: HTMLAttributes<HTMLElement>;
      base: HTMLVoidAttributes<HTMLBaseElement>;
      bdi: HTMLAttributes<HTMLElement>;
      bdo: HTMLAttributes<HTMLElement>;
      big: HTMLAttributes<HTMLElement>;
      blockquote: HTMLAttributes<HTMLQuoteElement>;
      body: HTMLAttributes<HTMLBodyElement>;
      br: HTMLVoidAttributes<HTMLBRElement>;
      button: HTMLButtonAttributes<HTMLButtonElement>;
      canvas: HTMLAttributes<HTMLCanvasElement>;
      caption: HTMLAttributes<HTMLElement>;
      col: HTMLVoidAttributes<HTMLTableColElement>;
      colgroup: HTMLAttributes<HTMLTableColElement>;
      data: DataHTMLAttributes<HTMLDataElement>;
      datalist: HTMLAttributes<HTMLDataListElement>;
      dd: HTMLAttributes<HTMLElement>;
      del: DelHTMLAttributes<HTMLModElement>;
      details: HTMLDetailsAttributes<HTMLDetailsElement>;
      dfn: HTMLAttributes<HTMLElement>;
      dialog: HTMLAttributes<HTMLDialogElement>;
      div: HTMLAttributes<HTMLDivElement>;
      dl: HTMLAttributes<HTMLDListElement>;
      dt: HTMLAttributes<HTMLElement>;
      em: HTMLAttributes<HTMLElement>;
      embed: HTMLEmbedAttributes<HTMLEmbedElement>;
      fieldset: HTMLFieldsetAttributes<HTMLFieldSetElement>;
      figcaption: HTMLAttributes<HTMLElement>;
      figure: HTMLAttributes<HTMLElement>;
      footer: HTMLAttributes<HTMLElement>;
      form: HTMLFormAttributes<HTMLFormElement>;
      h1: HTMLAttributes<HTMLHeadingElement>;
      h2: HTMLAttributes<HTMLHeadingElement>;
      h3: HTMLAttributes<HTMLHeadingElement>;
      h4: HTMLAttributes<HTMLHeadingElement>;
      h5: HTMLAttributes<HTMLHeadingElement>;
      h6: HTMLAttributes<HTMLHeadingElement>;
      head: HTMLAttributes<HTMLHeadElement>;
      header: HTMLAttributes<HTMLElement>;
      hgroup: HTMLAttributes<HTMLElement>;
      hr: HTMLVoidAttributes<HTMLHRElement>;
      html: HTMLAttributes<HTMLHtmlElement>;
      i: HTMLAttributes<HTMLElement>;
      iframe: HTMLIframeAttributes<HTMLIFrameElement>;
      img: HTMLImgAttributes<HTMLImageElement>;
      input: HTMLInputAttributes<HTMLInputElement>;
      ins: InsHTMLAttributes<HTMLModElement>;
      kbd: HTMLAttributes<HTMLElement>;
      // keygen: HTMLAttributes<HTMLElement>;
      label: HTMLLabelAttributes<HTMLLabelElement>;
      legend: HTMLLegendAttributes<HTMLLegendElement>;
      li: HTMLAttributes<HTMLLIElement>;
      link: HTMLLinkAttributes<HTMLLinkElement>;
      main: HTMLAttributes<HTMLElement>;
      map: HTMLAttributes<HTMLMapElement>;
      mark: HTMLAttributes<HTMLElement>;
      menu: HTMLAttributes<HTMLElement>;
      // menuitem: HTMLAttributes<HTMLElement>;
      meta: HTMLMetaAttributes<HTMLMetaElement>;
      meter: HTMLMeterAttributes<HTMLMeterElement>;
      noindex: HTMLAttributes<HTMLElement>;
      noscript: HTMLAttributes<HTMLElement>;
      object: HTMLObjectAttributes<HTMLObjectElement>;
      ol: HTMLAttributes<HTMLOListElement>;
      optgroup: HTMLOptgroupAttributes<HTMLOptGroupElement>;
      option: HTMLOptionAttributes<HTMLOptionElement>;
      output: HTMLOutputAttributes<HTMLOutputElement>;
      p: HTMLAttributes<HTMLParagraphElement>;
      param: HTMLParamAttributes<HTMLParamElement>;
      picture: HTMLAttributes<HTMLElement>;
      pre: HTMLAttributes<HTMLPreElement>;
      progress: HTMLProgressAttributes<HTMLProgressElement>;
      q: HTMLAttributes<HTMLQuoteElement>;
      rp: HTMLAttributes<HTMLElement>;
      rt: HTMLAttributes<HTMLElement>;
      ruby: HTMLAttributes<HTMLElement>;
      s: HTMLAttributes<HTMLElement>;
      samp: HTMLAttributes<HTMLElement>;
      search: HTMLAttributes<HTMLElement>;
      slot: HTMLAttributes<HTMLSlotElement>;
      script: HTMLScriptAttributes<HTMLScriptElement>;
      section: HTMLAttributes<HTMLElement>;
      select: HTMLSelectAttributes<HTMLSelectElement>;
      small: HTMLAttributes<HTMLElement>;
      source: SourceHTMLAttributes<HTMLSourceElement>;
      span: HTMLAttributes<HTMLSpanElement>;
      strong: HTMLAttributes<HTMLElement>;
      style: HTMLAttributes<HTMLStyleElement>;
      sub: HTMLAttributes<HTMLElement>;
      summary: HTMLSummaryAttributes<HTMLElement>;
      sup: HTMLAttributes<HTMLElement>;
      table: HTMLTableAttributes<HTMLTableElement>;
      template: HTMLAttributes<HTMLTemplateElement>;
      tbody: HTMLAttributes<HTMLTableSectionElement>;
      td: TdHTMLAttributes<HTMLTableDataCellElement>;
      textarea: HTMLTextAreaAttributes<HTMLTextAreaElement>;
      tfoot: HTMLAttributes<HTMLTableSectionElement>;
      th: ThHTMLAttributes<HTMLTableHeaderCellElement>;
      thead: HTMLAttributes<HTMLTableSectionElement>;
      time: TimeHTMLAttributes<HTMLTimeElement>;
      title: HTMLAttributes<HTMLTitleElement>;
      tr: HTMLAttributes<HTMLTableRowElement>;
      track: TrackHTMLAttributes<HTMLTrackElement>;
      u: HTMLAttributes<HTMLElement>;
      ul: HTMLAttributes<HTMLUListElement>;
      var: HTMLAttributes<HTMLElement>;
      video: HTMLVideoAttributes<HTMLVideoElement>;
      wbr: HTMLVoidAttributes<HTMLElement>;

      // [elemName: string]: Record<string, any> & { key?: string | number };
    }

    interface ElementChildrenAttribute {
      children: object;
    }

    interface ElementAttributesProperty {
      props: object; // Enables props validation
    }

    interface Attributes {
      key?: string | number;
    }

    type LibraryManagedAttributes<_C, P> = P & { key?: string | number };
  }
}
