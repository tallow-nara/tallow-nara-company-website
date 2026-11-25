import type { Payload } from 'payload'

import { NavDashboardLinkClient } from './NavDashboardLinkClient'

export function NavDashboardLink({ payload }: { payload: Payload }) {
  return <NavDashboardLinkClient adminRoute={payload.config.routes.admin} />
}
