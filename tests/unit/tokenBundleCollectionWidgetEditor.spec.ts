/**
 * TokenBundleCollection widget editor descriptor + tab oracle.
 *
 * Installing the token-payment-admin plugin registers a widget editor descriptor
 * for componentName 'TokenBundleCollection' through the SHARED cms-admin seam (no
 * token strings in cms-admin — OCP). The descriptor carries the shared config
 * contract that the fe-user TokenBundleCollection component reads; its editor tab
 * renders a live token-bundle dual-list, a default_view select and a heading
 * input, and binds v-model:config (bundle_ids round-trips as a string[], the
 * strings for default_view/heading).
 *
 * Engineering requirements (binding, restated): TDD-first (this RED set); SOLID
 * (OCP via the registry seam; SRP — the descriptor owns its config/preview);
 * DRY; Liskov; clean code; no overengineering. Quality guard: ``npm run test``
 * + ``npm run lint`` + ``vue-tsc``.
 */
import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import type { Component } from 'vue';
import { PluginRegistry, PlatformSDK } from 'vbwd-view-component';
import tokenPaymentAdminPlugin from '../../index';
import { getWidgetEditor, registerWidgetEditor } from '../../../cms-admin/index';
import { registerTokenBundleCollectionWidgetEditor } from '../../src/widgets/registerTokenBundleCollectionWidgetEditor';

beforeAll(() => {
  registerTokenBundleCollectionWidgetEditor(registerWidgetEditor);
});

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/api/v1/admin/token-bundles')) {
        return {
          ok: true,
          json: async () => ({
            items: [
              { id: 'bundle-1', name: 'Starter', token_amount: 100 },
              { id: 'bundle-2', name: 'Pro', token_amount: 500 },
            ],
          }),
        } as Response;
      }
      return { ok: true, json: async () => ({}) } as Response;
    }),
  );
});

describe('TokenBundleCollection editor descriptor', () => {
  it('registers a TokenBundleCollection descriptor through the shared seam', () => {
    expect(getWidgetEditor('TokenBundleCollection')).toBeDefined();
  });

  it('defaultConfig() returns the shared contract shape', () => {
    const descriptor = getWidgetEditor('TokenBundleCollection')!;
    const config = descriptor.defaultConfig();
    expect(config).toMatchObject({
      component_name: 'TokenBundleCollection',
      bundle_ids: [],
      default_view: 'cards',
    });
    expect(Array.isArray(config.bundle_ids)).toBe(true);
  });

  it('cssHint targets the widget root class', () => {
    const descriptor = getWidgetEditor('TokenBundleCollection')!;
    expect(descriptor.cssHint).toBeTruthy();
    expect(descriptor.cssHint).toContain('token-bundle-collection');
  });

  it('buildPreview emits a static bundle-card mock containing the heading', () => {
    const descriptor = getWidgetEditor('TokenBundleCollection')!;
    const preview = descriptor.buildPreview({
      component_name: 'TokenBundleCollection',
      heading: 'Top up tokens',
    });
    expect(typeof preview.html).toBe('string');
    expect(preview.html).toContain('token-bundle-collection');
    expect(preview.html).toContain('Top up tokens');
  });
});

describe('TokenBundleCollection editor tab', () => {
  function getDescriptor() {
    return getWidgetEditor('TokenBundleCollection')!;
  }

  it('renders the default_view select and the heading input', () => {
    const descriptor = getDescriptor();
    const wrapper = mount(descriptor.generalTabComponent as Component, {
      props: { config: descriptor.defaultConfig() },
      global: { mocks: { $t: (key: string) => key } },
    });
    expect(wrapper.find('[data-test="default-view"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="heading"]').exists()).toBe(true);
  });

  it('renders the live token-bundle dual-list with name + token_amount labels', async () => {
    const descriptor = getDescriptor();
    const wrapper = mount(descriptor.generalTabComponent as Component, {
      props: { config: descriptor.defaultConfig() },
      global: { mocks: { $t: (key: string) => key } },
    });
    await flushPromises();
    expect(wrapper.find('[data-testid="dual-list-bundles"]').exists()).toBe(true);
    const html = wrapper.html();
    expect(html).toContain('Starter (100 tokens)');
    expect(html).toContain('Pro (500 tokens)');
  });

  it('binds bundle_ids as a string[] via the dual-list', async () => {
    const descriptor = getDescriptor();
    const wrapper = mount(descriptor.generalTabComponent as Component, {
      props: { config: descriptor.defaultConfig() },
      global: { mocks: { $t: (key: string) => key } },
    });
    await flushPromises();
    await wrapper.find('[data-testid="dual-list-assign-bundle-1"]').trigger('click');
    const emitted = wrapper.emitted('update:config');
    expect(emitted).toBeTruthy();
    const lastPayload = emitted![emitted!.length - 1][0] as Record<string, unknown>;
    expect(Array.isArray(lastPayload.bundle_ids)).toBe(true);
    expect(lastPayload.bundle_ids).toEqual(['bundle-1']);
  });

  it('emits default_view as a string when the select changes', async () => {
    const descriptor = getDescriptor();
    const wrapper = mount(descriptor.generalTabComponent as Component, {
      props: { config: descriptor.defaultConfig() },
      global: { mocks: { $t: (key: string) => key } },
    });
    await wrapper.find('[data-test="default-view"]').setValue('table');
    const emitted = wrapper.emitted('update:config');
    expect(emitted).toBeTruthy();
    const lastPayload = emitted![emitted!.length - 1][0] as Record<string, unknown>;
    expect(lastPayload.default_view).toBe('table');
  });

  it('emits heading as a string when the input changes', async () => {
    const descriptor = getDescriptor();
    const wrapper = mount(descriptor.generalTabComponent as Component, {
      props: { config: descriptor.defaultConfig() },
      global: { mocks: { $t: (key: string) => key } },
    });
    await wrapper.find('[data-test="heading"]').setValue('Buy tokens');
    const emitted = wrapper.emitted('update:config');
    expect(emitted).toBeTruthy();
    const lastPayload = emitted![emitted!.length - 1][0] as Record<string, unknown>;
    expect(lastPayload.heading).toBe('Buy tokens');
  });
});

describe('token-payment-admin install() wires the widget editor', () => {
  it('registers TokenBundleCollection through the cms-admin seam on install', async () => {
    const registry = new PluginRegistry();
    const sdk = new PlatformSDK();
    registry.register(tokenPaymentAdminPlugin);
    await registry.installAll(sdk);

    for (let attempt = 0; attempt < 50 && !getWidgetEditor('TokenBundleCollection'); attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    expect(getWidgetEditor('TokenBundleCollection')).toBeDefined();
  });
});
