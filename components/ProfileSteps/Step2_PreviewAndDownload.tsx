import CanvasPreview from '@/components/CanvasPreview'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { useRef, useEffect } from 'react'
import assetLabels from '@/lib/assetLabels'

const labels = assetLabels

type Props = {
  image: File
  overlayFile: string
  setOverlayFile: (file: string) => void
  onReset: () => void
}

export default function Step2_PreviewAndDownload({
  image,
  overlayFile,
  setOverlayFile,
  onReset,
}: Props) {
  const handleDownloadLog = async () => {
    try {
      await supabase.from('image_creations').insert({
        asset: overlayFile,
        anonymous_id: localStorage.getItem('anonymous_id'),
        user_agent: navigator.userAgent,
        stage: 'downloaded',
      })
    } catch (err) {
      console.error('다운로드 기록 실패:', err)
    }
  }

  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    const timeout = setTimeout(() => {
      const selectedIndex = labels.findIndex(
        (_, i) => overlayFile === `517asset-${String(i).padStart(2, '0')}.png`
      )
      const selectedRef = buttonRefs.current[selectedIndex]
      if (selectedRef) {
        selectedRef.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        })
      }
    }, 50)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="w-full">
      <div className="overflow-x-auto pb-2 custom-scrollbar">
        <div className="flex gap-3">
          {labels.map((label, i) => {
            const asset = `517asset-${String(i).padStart(2, '0')}.png`
            const selected = overlayFile === asset
            return (
              <button
                key={asset}
                ref={(el: HTMLButtonElement | null) => {
                  buttonRefs.current[i] = el
                }}
                onClick={() => setOverlayFile(asset)}
                className={`flex flex-col items-center justify-center w-24 shrink-0 p-2 rounded-xl border text-xs transition ${
                  selected
                    ? 'border-[#BD3108] bg-[#FFF3E0] text-[#BD3108] shadow-sm'
                    : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <Image
                  src={`/${asset}`}
                  alt={label}
                  width={48}
                  height={48}
                  className="mb-1"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
                <span className="text-center whitespace-pre-line leading-tight">
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-6">
        <CanvasPreview
          image={image}
          overlay={overlayFile}
          onDownload={handleDownloadLog}
          onReset={onReset}
        />
      </div>
    </div>
  )
}
