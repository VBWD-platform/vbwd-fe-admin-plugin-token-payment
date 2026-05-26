# Token Payment Admin Plugin (vbwd-fe-admin)

Pure injection plugin — no UI of its own. Registers a contributor for the
`tokens_paid` namespace inside `vbwd_user_invoice.metadata` so the shared
fe-core `PaymentDataBlock` renders **"Paid with tokens · N tokens"** on the
admin invoice-detail screen.

## Purpose

vbwd core is agnostic of any payment method. When the backend
[`vbwd-plugin-token-payment`](https://github.com/VBWD-platform/vbwd-plugin-token-payment)
captures a payment via the token wallet, it writes
`invoice.metadata.tokens_paid = {amount: N}`. The shared fe-core
`PaymentDataBlock` (`vbwd-view-component`) iterates the metadata namespaces
and asks the `paymentDataContributors` registry how to render each. This
plugin teaches the admin app how to render the `tokens_paid` namespace —
identical to what fe-user does via
[`vbwd-fe-user-plugin-token-payment`](https://github.com/VBWD-platform/vbwd-fe-user-plugin-token-payment).

## Architecture

```
backend token-payment plugin
  ↓ POST /api/v1/plugins/token-payment/invoices/:id/pay
  ↓ writes invoice.metadata.tokens_paid = {amount: N}
admin app loads invoice
  ↓ fe-core <PaymentDataBlock :metadata="invoice.metadata" />
  ↓ block asks paymentDataContributors registry
  ↑ this plugin: { label: "Paid with tokens", format: ({amount}) => `${amount} tokens` }
```

## Related

|         | Repository                                                                       |
| ------- | -------------------------------------------------------------------------------- |
| 🖥 Backend | <https://github.com/VBWD-platform/vbwd-plugin-token-payment>                     |
| 👤 fe-user | <https://github.com/VBWD-platform/vbwd-fe-user-plugin-token-payment>             |
| 🔒 fe-admin| this repo                                                                        |

## Engineering requirements

TDD-first · DevOps-first · SOLID · DI · DRY · Liskov · clean code · NO OVERENGINEERING.
`bin/pre-commit-check.sh` is the quality guard.

## License

BSL 1.1 — see [LICENSE](./LICENSE).
