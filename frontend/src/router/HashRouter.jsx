import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const RouterContext = createContext({ path: '/', navigate: () => {} })

const normalize = (p) => {
  if (!p) return '/'
  const cleaned = ('/' + p).replace(/\/+/, '/').replace(/\/+$/, '')
  return cleaned === '' ? '/' : cleaned
}

export function HashRouter({ children, notFound = null }) {
  const getPath = () => normalize(window.location.hash.slice(1) || '/')
  const [path, setPath] = useState(getPath)

  useEffect(() => {
    const onHashChange = () => setPath(getPath())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = (to, { replace = false } = {}) => {
    if (!to) return
    const hash = '#' + normalize(to)
    if (replace) {
      const url = new URL(window.location.href)
      url.hash = hash
      window.location.replace(url.toString())
    } else {
      window.location.hash = hash
    }
  }

  const value = useMemo(() => ({ path, navigate }), [path])

  return (
    <RouterContext.Provider value={value}>
      <Routes notFound={notFound}>{children}</Routes>
    </RouterContext.Provider>
  )
}

export function Routes({ children, notFound = null }) {
  const { path } = useRouter()
  const arr = React.Children.toArray(children)
  for (const child of arr) {
    if (React.isValidElement(child) && child.type === Route) {
      if (matchPath(child.props.path, path)) {
        return child.props.element ?? null
      }
    }
  }
  return notFound
}

function matchPath(routePath, currentPath) {
  if (!routePath) return false
  return normalize(routePath) === normalize(currentPath)
}

export function Route(_props) {
  return null
}

export function Link({ to, children, ...rest }) {
  const href = '#' + normalize(to)
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  )
}

export function Navigate({ to, replace = true }) {
  const { navigate } = useRouter()
  useEffect(() => {
    navigate(to, { replace })
  }, [to, replace, navigate])
  return null
}

export function useRouter() {
  return useContext(RouterContext)
}

export function useNavigate() {
  return useRouter().navigate
}

export function usePath() {
  return useRouter().path
}
