'use client'

export const inputCls = 'w-full bg-[#0D0D0D] border border-[#222] px-4 py-2.5 text-sm text-white placeholder:text-[#444] focus:border-[#C9A84C] focus:outline-none transition-colors'
export const labelCls = 'block text-xs text-[#666] mb-1.5 font-mono uppercase tracking-wider'
export const selectCls = `${inputCls} cursor-pointer`

interface FieldProps {
  label: string
  required?: boolean
  children: React.ReactNode
}

export function Field({ label, required, children }: FieldProps) {
  return (
    <div>
      <label className={labelCls}>
        {label}{required && <span className="text-[#C9A84C] ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

interface SaveBarProps {
  saving: boolean
  onSave: () => void
  onSaveDraft?: () => void
  previewUrl?: string
  onDelete?: () => void
  isEdit?: boolean
}

export function SaveBar({ saving, onSave, onSaveDraft, previewUrl, onDelete, isEdit }: SaveBarProps) {
  return (
    <div className="flex items-center gap-3 border-t border-[#222] pt-6 mt-6">
      {onSaveDraft && (
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={saving}
          className="px-6 py-2.5 border border-[#333] text-sm text-[#aaa] hover:border-[#555] transition-colors disabled:opacity-50"
        >
          Save Draft
        </button>
      )}
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="px-6 py-2.5 bg-[#C9A84C] text-black text-sm font-medium hover:bg-[#E2C97A] transition-colors disabled:opacity-50"
      >
        {saving ? 'Saving…' : isEdit ? 'Update' : 'Save & Publish'}
      </button>
      {previewUrl && (
        <a href={previewUrl} target="_blank" rel="noopener noreferrer"
          className="text-xs text-[#555] hover:text-[#aaa] transition-colors ml-2">
          ↗ View live
        </a>
      )}
      {onDelete && isEdit && (
        <button
          type="button"
          onClick={onDelete}
          disabled={saving}
          className="ml-auto px-4 py-2.5 border border-red-900 text-sm text-red-500 hover:border-red-700 transition-colors disabled:opacity-50"
        >
          Delete
        </button>
      )}
    </div>
  )
}
