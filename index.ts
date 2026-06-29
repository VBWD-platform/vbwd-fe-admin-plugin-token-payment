/**
 * Token Payment Admin Plugin (fe-admin)
 *
 * Pure injection plugin — no UI of its own. Registers a contributor for the
 * ``tokens_paid`` namespace inside ``vbwd_user_invoice.metadata`` so the
 * shared fe-core ``PaymentDataBlock`` can render
 *   "Paid with tokens · N tokens"
 * on the admin invoice-detail screen, matching exactly what the user sees in
 * fe-user. Core stays agnostic of any payment method.
 *
 * Related repos:
 *   - Backend:  https://github.com/VBWD-platform/vbwd-plugin-token-payment
 *   - fe-user:  https://github.com/VBWD-platform/vbwd-fe-user-plugin-token-payment
 *   - fe-admin: this repo.
 */
import type { IPlugin, IPlatformSDK } from 'vbwd-view-component';
import { registerPaymentDataContributor } from 'vbwd-view-component';
import en from './locales/en.json';
import de from './locales/de.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import ja from './locales/ja.json';
import ru from './locales/ru.json';
import th from './locales/th.json';
import zh from './locales/zh.json';

export const tokenPaymentAdminPlugin: IPlugin = {
  name: 'token-payment-admin',
  version: '1.0.0',
  dependencies: ['cms-admin'],
  description: 'Renders the tokens_paid namespace inside the shared PaymentDataBlock on admin invoice detail',
  _active: false,

  install(sdk: IPlatformSDK): void {
    registerPaymentDataContributor('tokens_paid', {
      label: 'Paid with tokens',
      format: (data) => {
        const amount = (data as { amount?: number } | null)?.amount ?? 0;
        return `${amount} tokens`;
      },
      order: 10,
    });

    // Translations for the TokenBundleCollection widget editor.
    sdk.addTranslations('en', { tokenPaymentAdmin: (en as Record<string, unknown>).tokenPaymentAdmin });
    sdk.addTranslations('de', { tokenPaymentAdmin: (de as Record<string, unknown>).tokenPaymentAdmin });
    sdk.addTranslations('es', { tokenPaymentAdmin: (es as Record<string, unknown>).tokenPaymentAdmin });
    sdk.addTranslations('fr', { tokenPaymentAdmin: (fr as Record<string, unknown>).tokenPaymentAdmin });
    sdk.addTranslations('ja', { tokenPaymentAdmin: (ja as Record<string, unknown>).tokenPaymentAdmin });
    sdk.addTranslations('ru', { tokenPaymentAdmin: (ru as Record<string, unknown>).tokenPaymentAdmin });
    sdk.addTranslations('th', { tokenPaymentAdmin: (th as Record<string, unknown>).tokenPaymentAdmin });
    sdk.addTranslations('zh', { tokenPaymentAdmin: (zh as Record<string, unknown>).tokenPaymentAdmin });

    // Register the TokenBundleCollection editor through the SHARED cms-admin
    // widget-editor seam (OCP). Dynamic import keeps cms-admin a soft
    // dependency — if cms-admin is absent the widget editor is simply not
    // registered.
    import('../cms-admin/index')
      .then(({ registerWidgetEditor }) => {
        import('./src/widgets/registerTokenBundleCollectionWidgetEditor').then(
          ({ registerTokenBundleCollectionWidgetEditor }) => {
            registerTokenBundleCollectionWidgetEditor(registerWidgetEditor);
          },
        );
      })
      .catch(() => {
        // cms-admin plugin not installed — skip widget-editor registration.
      });
  },

  activate(): void {
    (this as IPlugin & { _active: boolean })._active = true;
  },

  deactivate(): void {
    (this as IPlugin & { _active: boolean })._active = false;
  },
};

export default tokenPaymentAdminPlugin;
