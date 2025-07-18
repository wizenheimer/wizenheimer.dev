"use client"

import { GithubIcon } from "lucide-react"
import { siteConfig } from "@/config/site"

export function GitHub() {
  return (
    <a 
      href={siteConfig.githubRepoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="px-4 py-2 border border-gray-700 hover:border-[var(--color-primary)] rounded"
    >
      <div className="w-[1.2rem] h-[1.2rem]">
        <GithubIcon className="h-[1.2rem] w-[1.2rem]" />
      </div>
      <span className="sr-only">GitHub repository</span>
    </a>
  )
}