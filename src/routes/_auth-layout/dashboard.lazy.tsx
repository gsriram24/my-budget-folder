import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_auth-layout/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Dashboard</div>
}
