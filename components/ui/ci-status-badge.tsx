"use client"

import type React from "react"
import { CheckCircle, XCircle, Clock, GitBranch, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface CIStatusBadgeProps {
  status: "success" | "failure" | "pending" | "running"
  jobName: string
  duration?: string
  link?: string
}

export function CIStatusBadge({ status, jobName, duration, link }: CIStatusBadgeProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />
      case "failure":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "running":
        return (
          <div className="h-5 w-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        )
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950"
      case "failure":
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
      case "running":
        return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950"
      case "pending":
        return "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950"
      default:
        return "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950"
    }
  }

  const content = (
    <Card className={`transition-all duration-200 hover:shadow-md ${getStatusColor()}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <h3 className="font-medium text-sm text-foreground">{jobName}</h3>
              {duration && (
                <p className="text-xs text-muted-foreground">{duration}</p>
              )}
            </div>
          </div>
          <div className="text-xs text-muted-foreground uppercase font-mono">
            {status}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (link) {
    return (
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block hover:scale-[1.02] transition-transform"
      >
        {content}
      </a>
    )
  }

  return content
}

interface CIPipelineStatusProps {
  pipelineId?: string
  branch?: string
}

export function CIPipelineStatus({ pipelineId = "Latest", branch = "main" }: CIPipelineStatusProps) {
  // 模拟 CI 状态数据
  const ciJobs = [
    { name: "🔍 Quality Gate", status: "success" as const, duration: "2m 15s" },
    { name: "🏗️ Build Verification", status: "success" as const, duration: "3m 42s" },
    { name: "🔍 PR Validation", status: "success" as const, duration: "1m 33s" },
    { name: "🛡️ Security Scan", status: "running" as const, duration: "5m 10s" },
  ]

  return (
    <Card className="border border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium text-foreground">CI Pipeline</span>
            <span className="text-sm text-muted-foreground">#{pipelineId}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4" />
            <span>{branch}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {ciJobs.map((job, index) => (
            <CIStatusBadge
              key={index}
              status={job.status}
              jobName={job.name}
              duration={job.duration}
            />
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            Pipeline started 8 minutes ago • 3 of 4 jobs completed
          </div>
        </div>
      </CardContent>
    </Card>
  )
}