/**
 * Static option lists + the shared config contract defaults for the
 * TokenBundleCollection widget editor.
 *
 * The fe-user TokenBundleCollection component reads these exact keys — do not
 * rename. An empty bundle_ids array means "all active bundles". Per
 * [[reference_admin_config_select_static_only]] the default_view select is
 * driven by a static array; the bundle dual-list is the live-data part.
 */
export const DEFAULT_VIEW_OPTIONS = ['cards', 'table'] as const;

export function tokenBundleCollectionDefaultConfig(): Record<string, unknown> {
  return {
    component_name: 'TokenBundleCollection',
    bundle_ids: [],
    default_view: 'cards',
    heading: '',
  };
}
