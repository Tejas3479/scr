// Archived copy of client/web/src/app/page.tsx
"use client"

import React from 'react'

const html = `
<section style="font-family: 'Poppins', sans-serif;"> ... </section>
`

export default function Landing() {
  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  )
}
