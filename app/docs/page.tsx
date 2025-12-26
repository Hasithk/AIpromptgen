import { redirect } from 'next/navigation'

export default function DocsPage() {
  // Redirect /docs to home page
  // Technical docs are internal only
  redirect('/')
}
