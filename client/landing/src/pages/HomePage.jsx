import React from 'react'

const html = `
${(function(){
    // Placeholder; the real HTML was copied to client/landing/public/index.html
    return '<div><h1>FarmQuest Landing</h1><p>Full landing page is in /client/landing/public/index.html</p></div>'
})()}
`

export default function HomePage(){
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
