export { F as Fragment } from './fragment-DHIT8DJc.js';

type EventHandler<E extends Event, T extends Element = Element> = (event: E & {
    currentTarget: T;
}) => void;
type MouseEventHandler<T extends Element = Element> = EventHandler<MouseEvent, T>;
type KeyboardEventHandler<T extends Element = Element> = EventHandler<KeyboardEvent, T>;
type FocusEventHandler<T extends Element = Element> = EventHandler<FocusEvent, T>;
type InputEventHandler<T extends Element = Element> = EventHandler<InputEvent, T>;
type SubmitEventHandler<T extends Element = Element> = EventHandler<SubmitEvent, T>;
type UIEventHandler<T extends Element = Element> = EventHandler<UIEvent, T>;
type WheelEventHandler<T extends Element = Element> = EventHandler<WheelEvent, T>;
type AnimationEventHandler<T extends Element = Element> = EventHandler<AnimationEvent, T>;
type TransitionEventHandler<T extends Element = Element> = EventHandler<TransitionEvent, T>;

type CoreAttributes = {
    id?: string;
    class?: string;
    style?: string | Partial<CSSStyleDeclaration>;
    title?: string;
    tabindex?: number;
    hidden?: boolean;
    draggable?: boolean;
    contentEditable?: boolean;
    accesskey?: string;
    lang?: string;
    spellcheck?: boolean;
    translate?: "yes" | "no";
    dir?: "ltr" | "rtl" | "auto";
    role?: string;
    slot?: string;
    part?: string;
    is?: string;
    autoCapitalize?: string;
    inputMode?: string;
    enterKeyHint?: string;
    radiogroup?: string;
    results?: number;
    security?: string;
    unselectable?: "on" | "off";
};
type EventAttributes<T extends Element = Element> = {
    onClick?: MouseEventHandler<T>;
    onDoubleClick?: MouseEventHandler<T>;
    onMouseDown?: MouseEventHandler<T>;
    onMouseUp?: MouseEventHandler<T>;
    onMouseEnter?: MouseEventHandler<T>;
    onMouseLeave?: MouseEventHandler<T>;
    onMouseOver?: MouseEventHandler<T>;
    onMouseOut?: MouseEventHandler<T>;
    onKeyDown?: KeyboardEventHandler<T>;
    onKeyUp?: KeyboardEventHandler<T>;
    onKeyPress?: KeyboardEventHandler<T>;
    onInput?: InputEventHandler<T>;
    onChange?: EventHandler<Event, T>;
    onFocus?: FocusEventHandler<T>;
    onBlur?: FocusEventHandler<T>;
    onSubmit?: SubmitEventHandler<T>;
    onReset?: EventHandler<Event, T>;
    onContextMenu?: MouseEventHandler<T>;
    onWheel?: WheelEventHandler<T>;
    onScroll?: UIEventHandler<T>;
    onResize?: UIEventHandler<T>;
    onAnimationStart?: AnimationEventHandler<T>;
    onAnimationEnd?: AnimationEventHandler<T>;
    onAnimationIteration?: AnimationEventHandler<T>;
    onTransitionEnd?: TransitionEventHandler<T>;
    onLoad?: EventHandler<Event, T>;
    onUnload?: EventHandler<Event, T>;
    onError?: EventHandler<Event, T>;
};
type AriaAttributes = {
    "aria-activedescendant"?: string;
    "aria-atomic"?: boolean;
    "aria-autocomplete"?: "inline" | "list" | "both" | "none";
    "aria-busy"?: boolean;
    "aria-checked"?: boolean | "mixed";
    "aria-colcount"?: number;
    "aria-colindex"?: number;
    "aria-colspan"?: number;
    "aria-controls"?: string;
    "aria-current"?: boolean | "page" | "step" | "location" | "date" | "time";
    "aria-describedby"?: string;
    "aria-details"?: string;
    "aria-disabled"?: boolean;
    "aria-dropeffect"?: "copy" | "execute" | "link" | "move" | "none" | "popup";
    "aria-errormessage"?: string;
    "aria-expanded"?: boolean;
    "aria-flowto"?: string;
    "aria-grabbed"?: boolean;
    "aria-haspopup"?: boolean | "dialog" | "menu" | "listbox" | "tree" | "grid";
    "aria-hidden"?: boolean;
    "aria-invalid"?: boolean | "grammar" | "spelling";
    "aria-keyshortcuts"?: string;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-level"?: number;
    "aria-live"?: "off" | "polite" | "assertive";
    "aria-modal"?: boolean;
    "aria-multiline"?: boolean;
    "aria-multiselectable"?: boolean;
    "aria-orientation"?: "horizontal" | "vertical";
    "aria-owns"?: string;
    "aria-placeholder"?: string;
    "aria-posinset"?: number;
    "aria-pressed"?: boolean | "mixed";
    "aria-readonly"?: boolean;
    "aria-relevant"?: string;
    "aria-required"?: boolean;
    "aria-roledescription"?: string;
    "aria-rowcount"?: number;
    "aria-rowindex"?: number;
    "aria-rowspan"?: number;
    "aria-selected"?: boolean;
    "aria-setsize"?: number;
    "aria-sort"?: "none" | "ascending" | "descending" | "other";
    "aria-valuemax"?: number;
    "aria-valuemin"?: number;
    "aria-valuenow"?: number;
    "aria-valuetext"?: string;
};
type HTMLAttributes<T extends Element = Element> = CoreAttributes & EventAttributes<T> & AriaAttributes & {
    children?: JSX.Element;
};
type HTMLVoidAttributes<T extends Element = Element> = Omit<HTMLAttributes<T>, "children">;
type HTMLAnchorAttributes<T extends Element = HTMLAnchorElement> = HTMLAttributes<T> & {
    download?: any;
    href?: string;
    hrefLang?: string;
    media?: string;
    ping?: string;
    rel?: string;
    target?: string;
    type?: string;
    referrerPolicy?: string;
};
type HTMLImgAttributes<T extends Element = HTMLImageElement> = HTMLVoidAttributes<T> & {
    alt?: string;
    crossOrigin?: "anonymous" | "use-credentials" | "";
    decoding?: "async" | "auto" | "sync";
    height?: number | string;
    loading?: "eager" | "lazy";
    referrerPolicy?: string;
    sizes?: string;
    src?: string;
    srcSet?: string;
    useMap?: string;
    width?: number | string;
};
type HTMLLabelAttributes<T extends Element = HTMLLabelElement> = HTMLAttributes<T> & {
    form?: string;
    for?: string;
};
type HTMLAudioAttributes<T extends Element = HTMLAudioElement> = HTMLMediaAttributes<T>;
type HTMLVideoAttributes<T extends Element = HTMLVideoElement> = HTMLMediaAttributes<T> & {
    height?: number | string;
    playsInline?: boolean;
    poster?: string;
    width?: number | string;
};
type HTMLMediaAttributes<T extends Element = HTMLMediaElement> = HTMLAttributes<T> & {
    autoPlay?: boolean;
    controls?: boolean;
    controlsList?: string;
    crossOrigin?: "anonymous" | "use-credentials" | "";
    loop?: boolean;
    mediaGroup?: string;
    muted?: boolean;
    preload?: "none" | "metadata" | "auto" | "";
    src?: string;
};
type HTMLIframeAttributes<T extends Element = HTMLIFrameElement> = HTMLAttributes<T> & {
    allow?: string;
    allowFullScreen?: boolean;
    height?: number | string;
    loading?: "eager" | "lazy";
    name?: string;
    referrerPolicy?: string;
    sandbox?: string;
    src?: string;
    srcDoc?: string;
    width?: number | string;
};
type HTMLEmbedAttributes<T extends Element = HTMLEmbedElement> = HTMLVoidAttributes<T> & {
    height?: number | string;
    src?: string;
    type?: string;
    width?: number | string;
};
type HTMLObjectAttributes<T extends Element = HTMLObjectElement> = HTMLAttributes<T> & {
    classID?: string;
    data?: string;
    form?: string;
    height?: number | string;
    name?: string;
    type?: string;
    useMap?: string;
    width?: number | string;
};
type HTMLLinkAttributes<T extends Element = HTMLLinkElement> = HTMLVoidAttributes<T> & {
    as?: string;
    crossOrigin?: string;
    href?: string;
    hrefLang?: string;
    integrity?: string;
    media?: string;
    referrerPolicy?: string;
    rel?: string;
    sizes?: string;
    type?: string;
    charSet?: string;
};
type HTMLMetaAttributes<T extends Element = HTMLMetaElement> = HTMLVoidAttributes<T> & {
    charSet?: string;
    content?: string;
    httpEquiv?: string;
    name?: string;
};
type HTMLScriptAttributes<T extends Element = HTMLScriptElement> = HTMLAttributes<T> & {
    async?: boolean;
    charSet?: string;
    crossOrigin?: string;
    defer?: boolean;
    integrity?: string;
    noModule?: boolean;
    nonce?: string;
    referrerPolicy?: string;
    src?: string;
    type?: string;
};
type HTMLInputAttributes<T extends Element = HTMLInputElement> = HTMLVoidAttributes<T> & {
    accept?: string;
    alt?: string;
    autoComplete?: string;
    autoFocus?: boolean;
    capture?: boolean | "user" | "environment";
    checked?: boolean;
    crossOrigin?: "anonymous" | "use-credentials" | "";
    disabled?: boolean;
    enterKeyHint?: "enter" | "done" | "go" | "next" | "previous" | "search" | "send";
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    height?: number | string;
    list?: string;
    max?: number | string;
    maxLength?: number;
    min?: number | string;
    minLength?: number;
    multiple?: boolean;
    name?: string;
    pattern?: string;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    size?: number;
    src?: string;
    step?: number | string;
    type?: string;
    value?: string | readonly string[] | number;
    width?: number | string;
};
type HTMLTextAreaAttributes<T extends Element = HTMLTextAreaElement> = HTMLAttributes<T> & {
    autoComplete?: string;
    autoFocus?: boolean;
    cols?: number;
    dirName?: string;
    disabled?: boolean;
    form?: string;
    maxLength?: number;
    minLength?: number;
    name?: string;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    rows?: number;
    wrap?: "hard" | "soft" | "off";
    value?: string | number | readonly string[];
};
type HTMLButtonAttributes<T extends Element = HTMLButtonElement> = HTMLAttributes<T> & {
    autoFocus?: boolean;
    disabled?: boolean;
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    type?: "submit" | "reset" | "button";
    value?: string | readonly string[] | number;
};
type HTMLSelectAttributes<T extends Element = HTMLSelectElement> = HTMLAttributes<T> & {
    autoComplete?: string;
    autoFocus?: boolean;
    disabled?: boolean;
    form?: string;
    multiple?: boolean;
    name?: string;
    required?: boolean;
    size?: number;
    value?: string | readonly string[] | number;
};
type HTMLOptionAttributes<T extends Element = HTMLOptionElement> = HTMLAttributes<T> & {
    disabled?: boolean;
    label?: string;
    selected?: boolean;
    value?: string | number | string[];
};
type HTMLFormAttributes<T extends Element = HTMLFormElement> = HTMLAttributes<T> & {
    acceptCharset?: string;
    action?: string;
    autoComplete?: string;
    encType?: string;
    method?: string;
    name?: string;
    noValidate?: boolean;
    target?: string;
};
type HTMLFieldsetAttributes<T extends Element = HTMLFieldSetElement> = HTMLAttributes<T> & {
    disabled?: boolean;
    form?: string;
    name?: string;
};
type HTMLLegendAttributes<T extends Element = HTMLLegendElement> = HTMLAttributes<T> & {};
type HTMLOptgroupAttributes<T extends Element = HTMLOptGroupElement> = HTMLAttributes<T> & {
    disabled?: boolean;
    label?: string;
};
type HTMLOutputAttributes<T extends Element = HTMLOutputElement> = HTMLAttributes<T> & {
    for?: string;
    form?: string;
    name?: string;
};
type HTMLParamAttributes<T extends Element = HTMLParamElement> = HTMLVoidAttributes<T> & {
    name?: string;
    value?: string;
};
type HTMLProgressAttributes<T extends Element = HTMLProgressElement> = HTMLAttributes<T> & {
    max?: number;
    value?: number;
};
type HTMLMeterAttributes<T extends Element = HTMLMeterElement> = HTMLAttributes<T> & {
    form?: string;
    high?: number;
    low?: number;
    max?: number;
    min?: number;
    optimum?: number;
    value?: string | number;
};
type HTMLDetailsAttributes<T extends Element = HTMLDetailsElement> = HTMLAttributes<T> & {
    open?: boolean;
};
type HTMLSummaryAttributes<T extends Element = HTMLElement> = HTMLAttributes<T>;
type HTMLTableAttributes<T extends Element = HTMLTableElement> = HTMLAttributes<T> & {
    cellPadding?: number | string;
    cellSpacing?: number | string;
    summary?: string;
};
type TdHTMLAttributes<T extends Element = HTMLTableDataCellElement> = HTMLAttributes<T> & {
    colSpan?: number;
    headers?: string;
    rowSpan?: number;
    scope?: string;
    abbr?: string;
    align?: string;
};
type ThHTMLAttributes<T extends Element = HTMLTableHeaderCellElement> = HTMLAttributes<T> & {
    colSpan?: number;
    headers?: string;
    rowSpan?: number;
    scope?: string;
    abbr?: string;
    align?: string;
};
type TimeHTMLAttributes<T extends Element = HTMLTimeElement> = HTMLAttributes<T> & {
    dateTime?: string;
};
type TrackHTMLAttributes<T extends Element = HTMLTrackElement> = HTMLVoidAttributes<T> & {
    default?: boolean;
    kind?: string;
    label?: string;
    src?: string;
    srcLang?: string;
};
type SourceHTMLAttributes<T extends Element = HTMLSourceElement> = HTMLVoidAttributes<T> & {
    media?: string;
    sizes?: string;
    src?: string;
    srcSet?: string;
    type?: string;
};
type DataHTMLAttributes<T extends Element = HTMLDataElement> = HTMLAttributes<T> & {
    value?: string | number;
};
type DelHTMLAttributes<T extends Element = HTMLModElement> = HTMLAttributes<T> & {
    cite?: string;
    dateTime?: string;
};
type InsHTMLAttributes<T extends Element = HTMLModElement> = HTMLAttributes<T> & {
    cite?: string;
    dateTime?: string;
};

// export {};



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

/**
 * jsx runtime
 *
 * @param type - The type of the element.
 * @param props - The properties of the element.
 * @param children - The children of the element.
 * @returns The JSX element.
 */
declare const jsx: (type: string | ((props: any) => any), { children, ...props }: Record<string, any>, key?: () => string) => any;

export { jsx, jsx as jsxs };
