import { useEffect } from 'react'
import { IconCheck } from './icons'

export default function Toast({ message, visible }) {
  return (
    <div className={`toast ${visible ? 'show' : ''}`}>
      <IconCheck />
      <span>{message}</span>
    </div>
  )
}
