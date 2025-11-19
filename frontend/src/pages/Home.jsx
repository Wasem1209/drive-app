import React from 'react'
import { Link } from '../router/HashRouter.jsx'

export default function Home() {
  return (
    <div className="card grid">
      <h1 className="typ-page-title">Drive App</h1>
      <p className="typ-subtext">Choose a section:</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link className="btn" to="/drivers">Drivers</Link>
        <Link className="btn" to="/passengers">Passengers</Link>
        <Link className="btn" to="/police">Police (restricted)</Link>
        <Link className="btn" to="/admin">Admin (restricted)</Link>
      </div>
    </div>
  )
}
