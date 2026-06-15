/**
 * Registers the TokenBundleCollection widget editor descriptor through the
 * SHARED cms-admin widget-editor seam (OCP).
 *
 * The token-payment-admin plugin owns this descriptor — cms-admin carries no
 * token strings. The registry function is imported from the stable cms-admin
 * plugin path, mirroring registerMeinchatChatWidgetEditor.
 */
import type { registerWidgetEditor as RegisterWidgetEditor } from '../../../cms-admin/index';
import TokenBundleCollectionWidgetEditorTab from './TokenBundleCollectionWidgetEditorTab.vue';
import { tokenBundleCollectionDefaultConfig } from './tokenBundleCollectionWidgetOptions';

export function registerTokenBundleCollectionWidgetEditor(
  registerWidgetEditor: typeof RegisterWidgetEditor,
): void {
  registerWidgetEditor({
    componentName: 'TokenBundleCollection',

    defaultConfig: tokenBundleCollectionDefaultConfig,

    generalTabComponent: TokenBundleCollectionWidgetEditorTab,

    cssHint:
      'Target <code>.token-bundle-collection</code>, <code>.token-bundle-collection__card</code>, <code>.token-bundle-collection__heading</code>.',

    buildPreview(config) {
      const heading = (config.heading as string) || '';
      const headingHtml = heading
        ? `<h2 class="token-bundle-collection__heading" style="text-align:center;margin:0 0 1rem;font-size:1.4rem;color:#1f2937">${heading}</h2>`
        : '';

      const html = `<div class="token-bundle-collection" style="font-family:inherit">
  ${headingHtml}
  <div class="token-bundle-collection__grid" style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap">
    <div class="token-bundle-collection__card" style="width:200px;padding:1.25rem;border:1px solid #e2e8f0;border-radius:10px;text-align:center;background:#fff">
      <div style="font-weight:600;color:#1f2937;margin-bottom:.5rem">Starter</div>
      <div style="font-size:1.6rem;font-weight:700;color:#3498db">100</div>
      <div style="font-size:.85rem;color:#6b7280;margin-top:.25rem">tokens</div>
    </div>
    <div class="token-bundle-collection__card" style="width:200px;padding:1.25rem;border:1px solid #e2e8f0;border-radius:10px;text-align:center;background:#fff">
      <div style="font-weight:600;color:#1f2937;margin-bottom:.5rem">Pro</div>
      <div style="font-size:1.6rem;font-weight:700;color:#3498db">500</div>
      <div style="font-size:.85rem;color:#6b7280;margin-top:.25rem">tokens</div>
    </div>
  </div>
</div>`;
      return { html };
    },
  });
}
