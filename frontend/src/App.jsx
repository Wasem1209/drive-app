import { useState } from 'react'
import './App.css'

function App() {
  return (
    <div>
      <div class="card grid">
        <h1 class="typ-page-title">Welcome</h1>
        <p class="typ-subtext">Subtext goes here.</p>

        <div class="field">
          <label class="field__label">Email</label>
          <input class="field__input" type="email" placeholder="you@example.com" />
          <small class="field__help">We’ll never share your email.</small>
        </div>

        <div class="flex" style="gap: var(--space-12);">
          <button class="btn typ-button">Primary</button>
          <button class="btn btn--accent typ-button">Accent</button>
          <button class="btn btn--danger typ-button">Danger</button>
        </div>
      </div>
    </div>
  )
}

export default App
