import { useState } from 'react'

export default function UploadFile() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [status, setStatus] = useState('')

  const onUpload = async (file: File) => {
    const fd = new FormData()
    fd.append('file', file)

    const res = await fetch('http://localhost:3001/upload', {
      method: 'POST',
      body: fd,
    })

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(errorText || 'Upload failed')
    }

    const data = await res.json()
    return data
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setStatus('Välj en fil först.')
      return
    }

    try {
      setStatus('Laddar upp...')
      const data = await onUpload(selectedFile)
      setStatus(`Klart! Fil uppladdad: ${data.filename ?? selectedFile.name}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Något gick fel.'
      setStatus(`Fel: ${message}`)
      console.error(error)
    }
  }

  return (
    <section>
      <h4>Upload a file</h4>
      <input
        type="file"
        onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
      />
      <button type="button" onClick={handleUpload}>
        Upload
      </button>
      {status && <p>{status}</p>}
    </section>
  )
}
