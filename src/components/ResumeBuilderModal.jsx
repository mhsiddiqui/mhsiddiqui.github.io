import { useEffect, useMemo, useState } from 'react'
import { Icon } from '@iconify/react'

const expKey = (e) => `${e.company}-${e.start}`

function SelectAllControls({ onAll, onNone }) {
  return (
    <div className="flex gap-2 text-xs">
      <button
        type="button"
        onClick={onAll}
        className="font-medium text-emerald-600 hover:text-emerald-700"
      >
        All
      </button>
      <span className="text-gray-300">·</span>
      <button
        type="button"
        onClick={onNone}
        className="font-medium text-gray-400 hover:text-gray-600"
      >
        None
      </button>
    </div>
  )
}

function CheckRow({ checked, onChange, label, sublabel }) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 rounded-md px-2 py-1.5 hover:bg-gray-50">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
      />
      <span className="text-sm leading-snug text-gray-700">
        {label}
        {sublabel && <span className="text-gray-400"> · {sublabel}</span>}
      </span>
    </label>
  )
}

export default function ResumeBuilderModal({
  cv,
  open,
  onClose,
  onDownload,
  loading,
}) {
  const [selExp, setSelExp] = useState(new Set())
  const [selProj, setSelProj] = useState(new Set())
  const [selSkill, setSelSkill] = useState(new Set())
  const [incEducation, setIncEducation] = useState(true)
  const [incPublications, setIncPublications] = useState(true)
  const [incOpenSource, setIncOpenSource] = useState(true)
  const [title, setTitle] = useState('')

  // (Re)initialise every time the modal opens — default: everything selected.
  useEffect(() => {
    if (!open) return
    setSelExp(new Set(cv.experience.map(expKey)))
    setSelProj(new Set(cv.projects.map((p) => p.name)))
    setSelSkill(new Set(cv.skills.map((s) => s.name)))
    setIncEducation(true)
    setIncPublications(true)
    setIncOpenSource(true)
    setTitle(cv.personal_info.title)
  }, [open, cv])

  // Escape to close (unless mid-generation).
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape' && !loading) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, loading, onClose])

  const toggle = (setFn) => (key) =>
    setFn((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })

  const filteredCv = useMemo(
    () => ({
      ...cv,
      personal_info: {
        ...cv.personal_info,
        title: title.trim() || cv.personal_info.title,
      },
      experience: cv.experience.filter((e) => selExp.has(expKey(e))),
      projects: cv.projects.filter((p) => selProj.has(p.name)),
      skills: cv.skills.filter((s) => selSkill.has(s.name)),
      education: incEducation ? cv.education : [],
      publications: incPublications ? cv.publications || [] : [],
      open_source_contributions: incOpenSource
        ? cv.open_source_contributions || []
        : [],
    }),
    [
      cv,
      title,
      selExp,
      selProj,
      selSkill,
      incEducation,
      incPublications,
      incOpenSource,
    ]
  )

  if (!open) return null

  const nothingSelected =
    selExp.size === 0 && selProj.size === 0 && selSkill.size === 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={loading ? undefined : onClose}
      />
      <div className="relative z-10 flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Customize your resume
            </h3>
            <p className="mt-0.5 text-sm text-gray-500">
              Pick what to include, then download. Fewer items keep it to a
              tight one-pager.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
            aria-label="Close"
          >
            <Icon icon="mdi:close" className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-4">
          {/* Title */}
          <div>
            <h4 className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-500">
              Title
            </h4>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={cv.personal_info.title}
              className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            />
          </div>

          {/* Experience */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500">
                Experience
              </h4>
              <SelectAllControls
                onAll={() => setSelExp(new Set(cv.experience.map(expKey)))}
                onNone={() => setSelExp(new Set())}
              />
            </div>
            {cv.experience.map((e) => (
              <CheckRow
                key={expKey(e)}
                checked={selExp.has(expKey(e))}
                onChange={() => toggle(setSelExp)(expKey(e))}
                label={e.role}
                sublabel={e.company}
              />
            ))}
          </div>

          {/* Projects */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500">
                Projects
              </h4>
              <SelectAllControls
                onAll={() => setSelProj(new Set(cv.projects.map((p) => p.name)))}
                onNone={() => setSelProj(new Set())}
              />
            </div>
            {cv.projects.map((p) => (
              <CheckRow
                key={p.name}
                checked={selProj.has(p.name)}
                onChange={() => toggle(setSelProj)(p.name)}
                label={p.name}
              />
            ))}
          </div>

          {/* Skills */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500">
                Skills
              </h4>
              <SelectAllControls
                onAll={() => setSelSkill(new Set(cv.skills.map((s) => s.name)))}
                onNone={() => setSelSkill(new Set())}
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {cv.skills.map((s) => {
                const active = selSkill.has(s.name)
                return (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => toggle(setSelSkill)(s.name)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                      active
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'
                    }`}
                  >
                    {s.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Extra sections */}
          <div>
            <h4 className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-500">
              Other sections
            </h4>
            {cv.education?.length > 0 && (
              <CheckRow
                checked={incEducation}
                onChange={() => setIncEducation((v) => !v)}
                label="Education"
              />
            )}
            {cv.publications?.length > 0 && (
              <CheckRow
                checked={incPublications}
                onChange={() => setIncPublications((v) => !v)}
                label="Publications"
              />
            )}
            {cv.open_source_contributions?.length > 0 && (
              <CheckRow
                checked={incOpenSource}
                onChange={() => setIncOpenSource((v) => !v)}
                label="Open Source"
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-6 py-4">
          <span className="text-xs text-gray-500">
            {selExp.size} roles · {selProj.size} projects · {selSkill.size}{' '}
            skills
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-full px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onDownload(filteredCv)}
              disabled={loading || nothingSelected}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-300/40 transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Icon icon="mdi:loading" className="h-4 w-4 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Icon icon="mdi:download" className="h-4 w-4" />
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
