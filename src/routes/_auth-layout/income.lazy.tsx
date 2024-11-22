import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_auth-layout/income')({
  component: RouteComponent,
})

function RouteComponent() {
  return 'Hello /_auth-layout/income!'
}
