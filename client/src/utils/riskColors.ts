import { RiskColor, RiskLevel } from "~/types/risk"
import { DocumentAnalysis } from "~/types"

export const getRiskColor = (risk: string): RiskColor => {
    const riskColors: Record<RiskLevel, RiskColor> = {
        "low": "secondary",
        "medium": "warning",
        "high": "error"
    }

    const riskLowerCase = risk.toLowerCase() as RiskLevel
    return ["low", "medium", "high"].includes(riskLowerCase) ? riskColors[riskLowerCase] : "secondary"
}


export const getLineColor = (issues: DocumentAnalysis['issues'], index: number): RiskColor | null => {
    const issueIndex = issues?.findIndex(issue => issue.line === index + 1) ?? -1
    if (issueIndex != -1 && issues) return getRiskColor(issues[issueIndex].risk_level)
    else return null
}