'use client'

import { useEffect } from 'react'
import { register } from '../sw'

export default function PWAInstaller() {
  useEffect(() => {
    register()
  }, [])

  return null
}