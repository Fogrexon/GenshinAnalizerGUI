import { AnalyzeResultViewer } from '#/components/AnalyzeResultViewer'
import { SimpleStore } from '#/utils/SimpleStore'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export const Result = () => {
  const [result, setResult] = useState<AnalyzeResult | null>(null)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    window.progressTarget.addEventListener('progress', (({
      detail: { progress }
    }: CustomEvent<{ progress: number }>) => {
      setProgress(progress)
    }) as EventListener)
    window.eel.analyze(SimpleStore.get<string>('elementType') ?? 'pyro')(
      (result_raw: AnalyzeResult): void => {
        setResult(result_raw)
      }
    )
  }, [])
  return (
    <div className="container">
      <h1>Result</h1>
      {result ? (
        <div>
          <AnalyzeResultViewer result={result} />
        </div>
      ) : (
        <div>loading...{Math.floor(progress * 100)}%</div>
      )}
      <Link to="/">Back to Home</Link>
    </div>
  )
}
