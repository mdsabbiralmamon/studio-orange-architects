"use client"
 
import { useEffect } from 'react'

interface PageTitleProps {
  title: string;
}

export default function PageTitle({ title }: PageTitleProps) {
  useEffect(() => {
    document.title = `Studio Orange︱${title}`
  }, [title])
 
  return null
}