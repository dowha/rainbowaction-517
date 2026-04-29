import Uploader from '@/components/Uploader'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import assetLabels from '@/lib/assetLabels'

const labels = assetLabels

type Props = {
  image: File | null
  setImage: (file: File | null) => void
  setOverlayFile: (file: string) => void
  overlayFile: string
  onNext: () => void
}

export default function Step1_UploadAndSelect({
  image,
  setImage,
  overlayFile,
  setOverlayFile,
  onNext,
}: Props) {
  const handleProceed = async () => {
    try {
      await supabase.from('image_creations').insert({
        asset: overlayFile,
        anonymous_id: localStorage.getItem('anonymous_id'),
        user_agent: navigator.userAgent,
        stage: 'selected',
      })
    } catch (err) {
      console.error('Supabase 기록 실패:', err)
    } finally {
      onNext()
    }
  }

  return (
    <div className="w-full">
      <Uploader
        onSelect={(file) => {
          setImage(file)
          setOverlayFile('517asset-00.png') // 기본 에셋
        }}
        onClear={() => {
          setImage(null)
          setOverlayFile('')
        }}
      />

      {image && (
        <>
          <div className="grid grid-cols-2 gap-3 my-6 animate-fade">
            {labels.map((label, i) => {
              const asset = `517asset-${String(i).padStart(2, '0')}.png`
              const selected = overlayFile === asset
              return (
                <div
                  key={asset}
                  role="button"
                  tabIndex={0}
                  onClick={() => setOverlayFile(asset)}
                  onKeyDown={(e) => e.key === 'Enter' && setOverlayFile(asset)}
                  className={`relative w-full h-28 rounded-xl border p-1 text-xs font-medium flex flex-col items-center justify-between text-center transition overflow-hidden cursor-pointer ${
                    selected
                      ? 'border-[#BD3108] bg-[#FFF3E0] text-gray-800 shadow-sm'
                      : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="relative w-12 h-12 mt-1">
                    <Image
                      src={`/${asset}`}
                      alt={label}
                      fill
                      className="object-contain"
                      sizes="48px"
                      draggable={false}
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  </div>
                  <span className="whitespace-pre-line leading-tight min-h-[2.75rem] flex items-center justify-center mb-1">
                    {label}
                  </span>

                  {selected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleProceed()
                        }}
                        className="px-4 py-1.5 bg-[#BD3108] bg-opacity-95 text-white text-xs rounded-full hover:bg-[#8B2200] transition shadow-md z-10"
                      >
                        ✅ 꾸미기 시작하기
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
