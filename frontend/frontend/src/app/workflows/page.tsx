import { redirect } from 'next/navigation'

export default function WorkflowsRedirect() {
  redirect('/settings?tab=workers')
}
