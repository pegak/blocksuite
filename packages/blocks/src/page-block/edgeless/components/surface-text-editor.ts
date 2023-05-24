import { ShadowlessElement } from '@blocksuite/lit';
import { Bound, type TextElement } from '@blocksuite/phasor';
import { assertExists } from '@blocksuite/store';
import { VEditor } from '@blocksuite/virgo';
import { html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import type { EdgelessPageBlockComponent } from '../edgeless-page-block.js';
import { getSelectedRect } from './utils.js';

@customElement('surface-text-editor')
export class SurfaceTextEditor extends ShadowlessElement {
  @query('.virgo-container')
  private _virgoContainer!: HTMLDivElement;

  private _vEditor: VEditor | null = null;
  private _rect: DOMRect | null = null;

  private _element: TextElement | null = null;
  private _edgeless: EdgelessPageBlockComponent | null = null;

  get vEditor() {
    return this._vEditor;
  }

  mount(element: TextElement, edgeless: EdgelessPageBlockComponent) {
    const rect = getSelectedRect([element], edgeless.surface.viewport);
    this._rect = rect;
    this._element = element;
    this._edgeless = edgeless;
    this._vEditor = new VEditor(element.text);

    this._vEditor.slots.updated.on(() => {
      const rect = this._virgoContainer.getBoundingClientRect();
      edgeless.surface.updateElement(element.id, {
        xywh: new Bound(
          element.x,
          element.y,
          rect.width / edgeless.surface.viewport.zoom,
          rect.height / edgeless.surface.viewport.zoom
        ).serialize(),
      });
      edgeless.slots.selectionUpdated.emit({
        selected: [element],
        active: true,
      });
    });

    edgeless.slots.viewportUpdated.on(() => {
      this._virgoContainer.blur();
    });

    this.requestUpdate();
    requestAnimationFrame(() => {
      assertExists(this._vEditor);
      this._vEditor.mount(this._virgoContainer);

      this._virgoContainer.addEventListener(
        'blur',
        () => {
          this.vEditor?.unmount();
          this.remove();
          edgeless.slots.selectionUpdated.emit({
            selected: [],
            active: false,
          });
        },
        {
          once: true,
        }
      );
    });
  }

  override render() {
    let virgoStyle = styleMap({});
    let backgroundStyle = styleMap({});
    if (this._rect && this._element && this._edgeless) {
      const verticalOffset =
        this._element.h / 2 -
        (this._element.lines.length * this._element.lineHeight) / 2;

      virgoStyle = styleMap({
        minWidth: this._element.w < 20 ? 20 : this._element.w + 'px',
        minHeight: this._element.h < 20 ? 20 : this._element.h + 'px',
        fontSize:
          this._element.fontSize * this._edgeless.surface.viewport.zoom + 'px',
        fontFamily: this._element.fontFamily,
        lineHeight: '1.5',
        outline: 'none',
      });
      backgroundStyle = styleMap({
        position: 'absolute',
        left: this._rect.x - 8 + 'px',
        top: this._rect.y - 8 + 'px',
        background: 'var(--affine-background-primary-color)',
        zIndex: '10',
        padding: `${verticalOffset + 8}px 8px`,
      });
    }

    return html`<div
      data-block-is-edgeless-text="true"
      style=${backgroundStyle}
    >
      <div style=${virgoStyle} class="virgo-container"></div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'surface-text-editor': SurfaceTextEditor;
  }
}