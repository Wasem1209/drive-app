import React from 'react'
import { Link } from '../router/HashRouter.jsx'

export default function Unauthorized() {
  return (
    <div className="card grid">
      <h2 className="typ-page-title">Unauthorized</h2>
      <p className="typ-subtext">You do not have access to this page.</p>
      <Link className="btn" to="/">Go Home</Link>
    </div>
  )
}
