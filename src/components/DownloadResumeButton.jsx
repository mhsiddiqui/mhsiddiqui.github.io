import { useState } from 'react'
import { Icon } from '@iconify/react'
import ResumeBuilderModal from './ResumeBuilderModal'

export default function DownloadResumeButton({ cv, className = '' }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDownload(selectedCv) {
    if (loading) return
    setLoading(true)
    try {
      const [{ pdf }, { ResumeDocument }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('./ResumeDocument.jsx'),
      ])
      const blob = await pdf(<ResumeDocument cv={selectedCv} />).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${cv.personal_info.name.replace(/\s+/g, '_')}_Resume.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 0)
      setOpen(false)
    } catch (err) {
      console.error('[Resume PDF] Generation failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-300/40 transition hover:shadow-xl hover:shadow-emerald-300/60 active:scale-[0.98] ${className}`}
      >
        <Icon icon="mdi:download" className="h-4 w-4" />
        Download Resume
      </button>

      <ResumeBuilderModal
        cv={cv}
        open={open}
        loading={loading}
        onClose={() => !loading && setOpen(false)}
        onDownload={handleDownload}
      />
    </>
  )
}
