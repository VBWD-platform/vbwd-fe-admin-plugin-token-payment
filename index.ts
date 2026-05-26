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

export const tokenPaymentAdminPlugin: IPlugin = {
  name: 'token-payment-admin',
  version: '1.0.0',
  description: 'Renders the tokens_paid namespace inside the shared PaymentDataBlock on admin invoice detail',
  _active: false,

  install(_sdk: IPlatformSDK): void {
    registerPaymentDataContributor('tokens_paid', {
      label: 'Paid with tokens',
      format: (data) => {
        const amount = (data as { amount?: number } | null)?.amount ?? 0;
        return `${amount} tokens`;
      },
      order: 10,
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
