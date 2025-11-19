import React from 'react'
import { Link } from '../router/HashRouter.jsx'

export default function NotFound() {
  return (
    <div className="card grid">
      <h2 className="typ-page-title">404 - Not Found</h2>
      <p className="typ-subtext">The page you are looking for does not exist.</p>
      <Link className="btn" to="/">Back to Home</Link>
    </div>
  )
}
